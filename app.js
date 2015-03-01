
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    dbName = "cmvBlog-" + (process.env.testing?"Testing":"Production"),
    expressJwt = require('express-jwt'),
    jwt = require('jsonwebtoken'),
    bodyParser = require('body-parser'),
    urlencode = bodyParser.urlencoded({ extended: false }),
    jsonBodyParser = bodyParser.json(),
    User = require('./models/user'),
    utl = require('./bin/utilities'),
    secret = utl.generatePassword()
;

if (process.env.testing) {  console.log("APPLICATION IS IN TESTING MODE!!!");  }
mongoose.connect('mongodb://localhost/'+dbName, function(error) {
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
    //if is invalid, return 401
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


var _postsRouter = require('./routes/api/posts');
app.use('/api/posts', expressJwt({secret: secret}), _postsRouter);


var _projectRouter = require('./routes/api/projects');
app.use('/api/projects', expressJwt({secret: secret}), _projectRouter);


var _usersRouter = require('./routes/api/users');
app.use('/api/users', expressJwt({secret: secret}), _usersRouter);


// Error Handeler
app.use(function(err, req, res, next){

    if (err.status === 401) {
        res.status(err.status).json(err.message || "Unauthorized Access");
    } else if (err.status) {
        res.status(err.status).json(err.message || "Unknown Error");
    } else {
        res.status(500).json("Something Went Horribly Wrong!!!");
    }

});

module.exports = app;
