var express = require('express'),
    router = express.Router(),
    Project = require('../models/project')
;

router.route('/')
    .get(function(request, response) {
        Project.find(function (errors, projects) {
            response.render('projects', {
                projects: projects,
                pageTitle: "Projects List",
                pageDescription: "Checkout a list of Web Development projects contributed to by Christopher Vachon."
            });
        });
    }) // close get
;

module.exports = router;
