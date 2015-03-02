var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    urlencode = bodyParser.urlencoded({ extended: false }),
    jsonBodyParser = bodyParser.json(),
    Project = require('../../models/project')
;

router.route('/')
    .get(function(request, response) {
        Project.find(function (errors, articles) {
          if (errors) {
              response.status(500).json(errors);
              return;
          }
          response.status(200).json(articles);
        });
    }) // close get
    .post(jsonBodyParser, urlencode, function(request, response) {
        if (!request.user.isAdmin) {
            response.status(401).json("Unauthorized");
            return;
        }

        var newProject = request.body;

        var errors = {};
        if ( !newProject.title ) { errors.title = "No title found"; }
        if ( !newProject.summary ) { errors.summary = "No summary found"; }

        if (Object.keys(errors).length > 0) {
            response.status(400).json({validationerrors: errors});
            return;
        }

        Project.create(newProject, function (error, post) {
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
        Project.findById(request.params.id, function (error, post) {
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
        if (!request.user.isAdmin) {
            response.status(401).json("Unauthorized");
            return;
        }

        Project.findByIdAndUpdate(request.params.id, request.body, function (error, post) {
          if (error) {
              response.status(400).json(error);
              return;
          }
          response.status(202).json(post);
        });
    }) // close put
    .delete(function(request, response) {
        if (!request.user.isAdmin) {
            response.status(401).json("Unauthorized");
            return;
        }

        Project.findByIdAndRemove(request.params.id, function (error, post) {
            if (error) {
                response.status(400).json(error);
                return;
            }
            response.status(204).json("");
        });
    }) // close delete

; // close route('/:index')

module.exports = router;
