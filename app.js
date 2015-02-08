
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    urlencode = bodyParser.urlencoded({ extended: false })
;


app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));


app.get('/', function (request, response) {
    response.render('index', {});
}); // close get('/')


var _blogRouter = require('./routes/blog');
app.use('/blog', _blogRouter);


module.exports = app;
