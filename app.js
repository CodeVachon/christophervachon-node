
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    dbName = "cmvBlog-" + (process.env.testing?"Testing":"Production"),
    passport = require('passport')
    authController = require('./auth')
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
app.use(passport.initialize());


app.get('/', function (request, response) {
    response.render('index', {});
}); // close get('/')


var _postsRouter = require('./routes/posts');
app.use('/api/posts', authController.isAuthenticated, _postsRouter);


var _projectRouter = require('./routes/projects');
app.use('/api/projects', authController.isAuthenticated, _projectRouter);


var _usersRouter = require('./routes/users');
app.use('/api/users', authController.isAuthenticated, _usersRouter);


module.exports = app;
