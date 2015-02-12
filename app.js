
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    dbName = "cmvBlog-" + (process.env.testing?"Testing":"Production")
;
mongoose.connect('mongodb://localhost/'+dbName, function(error) {
    if(error) {
        console.log('mongodb connection error', error);
    } else if (!process.env.testing) {
        console.log('mongodb connection ['+dbName+'] successful');
    }
});


if (process.env.testing) {
    console.log("TESTING ENVIROMENT!!!");
}

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));


app.get('/', function (request, response) {
    response.render('index', {});
}); // close get('/')


var _postsRouter = require('./routes/posts');
app.use('/posts', _postsRouter);


var _projectRouter = require('./routes/projects');
app.use('/projects', _projectRouter);

module.exports = app;
