var express = require('express'),
    router = express.Router(),
    Project = require('../models/project')
;

router.route('/')
    .get(function(request, response) {
        Project.find(function (errors, projects) {
            response.render('projects', {projects: projects});
        });
    }) // close get
;

module.exports = router;
