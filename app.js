var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    expressJwt = require('express-jwt'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    urlencode = bodyParser.urlencoded({ extended: false }),
    jsonBodyParser = bodyParser.json(),
    User = require('./models/user'),
    utl = require('./bin/utilities'),
    secret = utl.generatePassword(),

    dbName = "cmvBlog-" + (process.env.testing?"Testing":"Production"),
    MongoURL = process.env.MONGO_URL || "mongodb://localhost/"+dbName,

    fs = require('fs'),
    _siteSettings = {defaults: {keywords:[]}},

    Twitter = require('twitter'),
    client = new Twitter({
        consumer_key: process.env.twitter_consumer_key || "uMdauo5lw43JRap1sRjY4ESBx",
        consumer_secret: process.env.twitter_consumer_secret || "79p2gvOuhDD6SioiFycLQSyMYQwIDrL8J0YbDPC2Z7jundM8rS",
        access_token_key: process.env.twitter_access_token_key || "18299192-zBBxEfw1XKXz4JI47kCwnKx2aZ0UA7JwOMgkx1tIt",
        access_token_secret: process.env.twitter_access_token_secret|| "d21YpMh1kFKmfTjjTYrNaswpJWgyLL0nAcUsoCxSqW9tV",
    }),
    Posts = require("./models/article"),
    md5 = require('MD5'),
    Showdown = require("./public/admin/js/vendor/showdown"),
    converter = new Showdown.converter({ extensions: ['twitter'] })
;

if (process.env.testing) {  console.log("APPLICATION IS IN TESTING MODE!!!");  }
mongoose.connect(MongoURL, function(error) {
    if(error) {
        console.log('mongodb connection error', error);
    } else if (process.env.testing) {
        console.log('mongodb connection ['+dbName+'] successful');
    }
});


/*  Set Site Settings  */
// These are avaliable in views in the `settings` scope
if (fs.existsSync(__dirname + '/site-settings.json')) {
    var _siteSettings = JSON.parse(fs.readFileSync(__dirname + '/site-settings.json', 'utf8')) || {}
}

app.set("title", _siteSettings.title || "No Title Set");
app.set("cssFiles", _siteSettings.cssFiles || [])
app.set("icoFiles", _siteSettings.icoFiles || [])
app.set("jsFiles", _siteSettings.jsFiles || [])
app.set("defaultDescription", _siteSettings.defaults.description || "" );
app.set("defaultKeywords",  _siteSettings.defaults.keywords.join(",") || "" );
app.set("defaultOGImage",  _siteSettings.defaults.OGImage || "" );
app.set("googleAnalytics",  _siteSettings.googleAnalytics || "" );

// This Creates a Request Scope that can be used inside of the Jade Views
app.use(function(request, response, next) {
    var _hostPath = "";
    var _canonical = [];
    _canonical.push(request.protocol + "://");
    if (request.subdomains.length > 0) {
        _canonical.push(request.subdomains.join(".") + ".");
    }
    _canonical.push(request.hostname);
    _hostPath = _canonical.join("").toLowerCase();
    _canonical.push(request.originalUrl);

    response.locals.request = {
        path: request.path,
        protocol: request.protocol,
        query: request.query,
        originalUrl: request.originalUrl,
        hostname: request.hostname,
        host: _hostPath,
        subdomains: request.subdomains.join("."),
        canonical: _canonical.join("").toLowerCase(),
        OGImage: _hostPath + _siteSettings.defaults.OGImage
    };
    next();
});



app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {

    var _endDate = new Date();
    Posts.find({
        "publish_date": {
            $lt: _endDate
        }
    }, null, {limit: 10, sort: {publish_date: -1}},function (error, posts) {
        if (error) { console.log(error); }
        //console.log(posts.length);
        var params = {screen_name: 'liaodrake', count: 10};
        client.get('statuses/user_timeline', params, function(error, tweets, t_response){
            if (error) { console.log(error); }
            //console.log(tweets.length);

            var RAW_activityfeed = {};
            for (var i=0,x=posts.length; i<x; i++) {
                RAW_activityfeed[ +new Date(posts[i].publish_date) ] = { 
                    type: "post",
                    data: posts[i]
                };
            }
            for (var i=0,x=tweets.length; i<x; i++) {
                RAW_activityfeed[ +new Date(tweets[i].created_at) ] = { 
                    type: "tweet",
                    data: tweets[i]
                };
                //console.log("---");
                //console.log(tweets[i].entities);
            }
            var RAW_activityfeed_timestamps = Object.keys(RAW_activityfeed);
            RAW_activityfeed_timestamps.sort().reverse();

            //console.log(RAW_activityfeed_timestamps);

            var activityfeed = [];
            for (var i=0,x=10; i<x; i++) {
                activityfeed.push(RAW_activityfeed[RAW_activityfeed_timestamps[i]]);
            }

            //console.log(activityfeed);

            response.render('index', {
                activityfeed: activityfeed,
                utl:utl,
                md5:md5,
                converter:converter,
                socialMedia: [
                    {
                        label:"Twitter",
                        url: "https://twitter.com/liaodrake",
                        imgsrc: "https://g.twimg.com/dev/documentation/image/Twitter_logo_blue_48.png",
                        username: "liaodrake"
                    }
                ]
            });
        }); // close client
    }); // close Posts.find
}); // close get('/')

// Handel Authentication Tokens
app.post('/api/authenticate', jsonBodyParser, urlencode, function (request, response) {
    if (!request.body.emailAddress) {
        response.status(400).json('Expected "emailAddress" not received');
        return;
    }
    if (!request.body.password) {
        response.status(400).json('Expected "password" not received');
        return;
    }

    User.findOne({ emailAddress: request.body.emailAddress }, function (error, user) {
        if (error) {
            response.status(401).json('Wrong user or password');
            return;
        }

        // No user found with that username
        if (!user) {
            response.status(401).json('Wrong user or password');
            return;
        }

        // Make sure the password is correct
        user.verifyPassword(request.body.password, function(error, isMatch) {
            if (error) {
                response.status(401).json('Wrong user or password');
                return;
            }

            // Password did not match
            if (!isMatch) {
                response.status(401).json('Wrong user or password');
                return;
            }

            // Success
            user.password = undefined;
            var token = jwt.sign(user, secret, { expiresInMinutes: 60*5 });
            response.json({ token: token, user: user });
        });
    });
}); // close app.post('/api/authenticate')

var _postsAPIRouter = require('./routes/api/posts');
app.use('/api/posts', expressJwt({secret: secret}), _postsAPIRouter);

var _projectAPIRouter = require('./routes/api/projects');
app.use('/api/projects', expressJwt({secret: secret}), _projectAPIRouter);

var _usersAPIRouter = require('./routes/api/users');
app.use('/api/users', expressJwt({secret: secret}), _usersAPIRouter);

var _projectsRouter = require('./routes/projects');
app.use('/projects', _projectsRouter);
app.use('/page/projects', function(request, response) {
    response.writeHead(302, {'Location': '/projects'});
    response.end();
});

var aboutRouter = require('./routes/about');
app.use('/about-me', aboutRouter);
app.use('/page/about-me', function(request, response) {
    response.writeHead(302, {'Location': '/about-me'});
    response.end();
});

var _blogRouter = require('./routes/blog');
app.use('/blog', _blogRouter);

app.use('*', function(request, response, next) {
    var _404Error = new Error();
    _404Error.status = 404;
    next(_404Error);
});

// Error Handeler
app.use(function(err, req, res, next){

    if (err.status === 401) {
        res.status(401).render("error401");
    } else if (err.status === 404) {
        res.status(404).render("error404");
    } else if (err.status === 412) {
        res.status(412).render("error412",{error: err});
    } else {
        console.log(err);
        res.status(500).render("error500");
    }

});

module.exports = app;
