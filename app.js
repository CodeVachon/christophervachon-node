
var express = require('express'),
    app = express(),
    articles = [],
    bodyParser = require('body-parser'),
    urlencode = bodyParser.urlencoded({ extended: false })
;

app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));


app.get('/', function (request, response) {
    response.render('index', {});
}); // close get('/')

app.post('/blog', urlencode, function(request, response) {
    var newArticle = request.body;

    if (
        !newArticle.title ||
        !newArticle.summary ||
        !newArticle.body
    ) {
        var errors = {};
        if ( !newArticle.title ) { errors.title = "No title found"; }
        if ( !newArticle.summary ) { errors.summary = "No summary found"; }
        if ( !newArticle.body ) { errors.body = "No body found"; }

        response.status(400).json(errors); return;
    }

    if ( !newArticle.postDateTime ) { newArticle.postDateTime = new Date(); }

    articles.push(newArticle);
    response.status(201).json(newArticle);
});

app.get('/blog', function(request, response) {
    response.status(200).json(articles);
});

app.get('/blog/:index', function(request, response) {
    if (
        typeof(request.params.index) === "number" &&
        request.params.index > 0 &&
        articles.length < request.params.index &&
        articles[request.params.index]
    ) {
        response.status(200).json(articles);
    } else {
        response.status(200).json(articles);
    }
});

module.exports = app;
