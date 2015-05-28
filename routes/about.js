var express = require('express'),
    router = express.Router()
;

router.route('/')
    .get(function(request, response) {
        response.render('about', {
            pageTitle: "About Me",
            pageDescription: "Who is Christopher Vachon from Midland, Ontario, Canada? Find out here!"
        });
    }) // close get
;

module.exports = router;
