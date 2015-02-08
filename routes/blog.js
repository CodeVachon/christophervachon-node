var express = require('express'),
    router = express.Router(),
    articles = [],
    bodyParser = require('body-parser'),
    urlencode = bodyParser.urlencoded({ extended: false })
;

router.route('/')
    .get(function(request, response) {
        response.status(200).json(articles);
    }) // close get
    .post(urlencode, function(request, response) {
        var newArticle = request.body;

        var errors = {};
        if ( !newArticle.title ) { errors.title = "No title found"; }
        if ( !newArticle.summary ) { errors.summary = "No summary found"; }
        if ( !newArticle.body ) { errors.body = "No body found"; }

        if (Object.keys(errors).length > 0) {
            response.status(400).json({validationerrors: errors});
            return;
        }

        if ( !newArticle.postDateTime ) {
            newArticle.postDateTime = new Date();
        }
        if ( !newArticle.isDraft ) {
            newArticle.isDraft = true;
        }

        articles.push(newArticle);
        response.status(201).json(newArticle);
    }) // close post
; // close route('/')

router.route('/:index')
    .get(function(request, response) {
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
    }) // close get
; // close route('/:index')

module.exports = router;
