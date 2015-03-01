var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    urlencode = bodyParser.urlencoded({ extended: false }),
    jsonBodyParser = bodyParser.json(),
    Article = require('../models/article')
;

router.route('/')
    .get(function(request, response) {
        Article.find(function (errors, articles) {
          if (errors) {
              response.status(500).json(errors);
              return;
          }
          response.status(200).json(articles);
        });
    }) // close get
    .post(jsonBodyParser, urlencode, function(request, response) {
        var newArticle = request.body;

        var errors = {};
        if ( !newArticle.title ) { errors.title = "No title found"; }
        if ( !newArticle.summary ) { errors.summary = "No summary found"; }
        if ( !newArticle.body ) { errors.body = "No body found"; }

        if (Object.keys(errors).length > 0) {
            response.status(400).json({validationerrors: errors});
            return;
        }

        if ( !newArticle.publish_date ) {
            newArticle.publish_date = new Date();
        }
        if ( !newArticle.isDraft ) {
            newArticle.isDraft = true;
        }

        Article.create(newArticle, function (error, post) {
          if (error) {
              response.status(500).json(error);
              return;
          }
          response.status(201).json(post);
        });
    }) // close post
; // close route('/')

router.route('/:id')
    .get(function(request, response) {
        Article.findById(request.params.id, function (error, post) {
          if (error) {
              response.status(500).json(error);
              return;
          }
          if (post == null) {
              response.status(404).json("Not found");
              return;
          }
          response.status(200).json(post);
        });
    }) // close get
    .put(jsonBodyParser, urlencode, function(request, response) {
        Article.findById(request.params.id, function (error, article) {
            if (error) {
                response.status(400).json(error);
                return;
            }

            var requestBodyKeys = Object.keys(request.body),
                _key = ""
            ;
            for (var i=0,x=requestBodyKeys.length; i<x; i++) {
                _key = requestBodyKeys[i];
                article[_key] = request.body[_key];
            }

            article.save(function(error) {
                if (error) {
                    response.status(400).json(error);
                    return;
                }
                response.status(202).json(article);
            });
        });
        /*
        Article.findByIdAndUpdate(request.params.id, request.body, function (error, post) {
          if (error) {
              response.status(400).json(error);
              return;
          }
          response.status(202).json(post);
        });
        */
    }) // close put
    .delete(function(request, response) {
        Article.findByIdAndRemove(request.params.id, function (error, post) {
            if (error) {
                response.status(400).json(error);
                return;
            }
            response.status(204).json("");
        });
    }) // close delete
; // close route('/:index')

module.exports = router;
