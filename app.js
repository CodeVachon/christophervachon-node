var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    dbName = "cmvBlog-" + (process.env.testing?"Testing":"production"),
    expressJwt = require('express-jwt'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    urlencode = bodyParser.urlencoded({ extended: false }),
    jsonBodyParser = bodyParser.json(),
    User = require('./models/user'),
    utl = require('./bin/utilities'),
    secret = utl.generatePassword(),

    MongoURL = process.env.MONGO_URL : "mongodb://localhost/"
;

if (process.env.testing) {  console.log("APPLICATION IS IN TESTING MODE!!!");  }
mongoose.connect(MongoURL+dbName, function(error) {
    if(error) {
        console.log('mongodb connection error', error);
    } else if (process.env.testing) {
        console.log('mongodb connection ['+dbName+'] successful');
    }
});

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
    response.render('index', {});
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

var _projectsRouter = require('./routes/about');
app.use('/about-me', _projectsRouter);
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
