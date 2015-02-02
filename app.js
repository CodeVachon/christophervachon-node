
var express = require('express'),
    app = express()
;

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));


app.get('/', function (request, response) {
    response.render('index', {});
}); // close get('/')

module.exports = app;
