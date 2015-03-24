var express = require('express'),
    router = express.Router(),
    Posts = require("./../models/article"),
    utl = require("./../bin/utilities"),
    // Use the same MarkDown as the Admin Editor...
    Showdown = require("./../public/admin/js/vendor/showdown"),
    converter = new Showdown.converter({ extensions: ['table','github'] })
;

router.route('/')
    .get(function(request, response) {
        Posts.find(null, null, {sort: {publish_date: -1}},function (errors, posts) {
            response.render('blogList', {
                posts: posts,
                utl: utl
            });
        }); // close Posts.find
    }) // close get
;
router.route('/:year')
    .get(_testDateParams, function(request, response, next) {

        var _startDate = new Date('Jan 1 ' + request.params.year + ' 00:00:00');
        var _endDate = new Date('Dec 31 ' + request.params.year + ' 23:59:59');

        Posts.find({
            "publish_date": {
                $gt: _startDate,
                $lt: _endDate
            }
        }, null, {sort: {publish_date: -1}}, function(error, posts) {
            if (error) {
                error.status = 500;
                next(error);
            } else {
                response.render('blogList', {
                    posts: posts,
                    utl: utl
                });
            }
        }); // close Posts.find

    }) // close .get
;
router.route('/:year/:month')
    .get(_testDateParams, function(request, response, next) {

        var _startDate = new Date();
        _startDate.setFullYear(request.params.year);
        _startDate.setMonth( parseInt(request.params.month)-1 );
        _startDate.setDate(1);
        _startDate.setHours(0);
        _startDate.setMinutes(0);
        _startDate.setSeconds(0);

        var _endDate = new Date(_startDate);
        _endDate.setMonth(_endDate.getMonth()+1);

        Posts.find({
            "publish_date": {
                $gt: _startDate,
                $lt: _endDate
            }
        }, null, {sort: {publish_date: -1}}, function(error, posts) {
            if (error) {
                error.status = 500;
                next(error);
            } else {
                response.render('blogList', {
                    posts: posts,
                    utl: utl
                });
            }
        }); // close Post.fine
    }) // close .get
;
router.route('/:year/:month/:day')
    .get(_testDateParams, function(request, response, next) {
        var _startDate = new Date();
        _startDate.setFullYear(request.params.year);
        _startDate.setMonth( parseInt(request.params.month)-1 );
        _startDate.setDate(request.params.day);
        _startDate.setHours(0);
        _startDate.setMinutes(0);
        _startDate.setSeconds(0);

        var _endDate = new Date(_startDate);
        _endDate.setDate(_endDate.getDate()+1);

        Posts.find({
            "publish_date": {
                $gt: _startDate,
                $lt: _endDate
            }
        }, null, {sort: {publish_date: -1}}, function(error, posts) {

            if (error) {
                console.log(error);
                error.status = 500;
                next(error);
                return;
            } else {

                if (posts.length > 1) {
                    response.render('blogList', {
                        posts: posts,
                        utl: utl
                    });
                    return;
                } else if (posts.length === 1) {
                    // 302 [temporary] redirect to the single blog. because there might be another post one day...
                    response.redirect(302, '/blog/' + request.params.year + "/" + request.params.month + "/"+ request.params.day + "/" + posts[0].safeurl);
                    return;
                } else {
                    var error = new Error();
                    error.status = 404;
                    error.message = "Value "+request.params.year+" is not an integer";
                    next(error);
                    return;
                }

            }
        }); // close Posts.find
    }) // close .get
;
router.route('/:year/:month/:day/:title')
    .get(_testDateParams, function(request, response, next) {
        Posts.findOne({safeurl: request.params.title}, function(error, post) {
            if (error) {
                error.status = 500;
                next(error);
            } else {
                if (post) {
                    response.render('blogView', {
                        post: post,
                        postBody: converter.makeHtml(post.body),
                        utl: utl
                    });
                } else {
                    var error = new Error();
                    error.status = 404;
                    error.message = "Article Not Found";
                    next(error);
                    return;
                }
            }
        }); // close Posts.findOne
    }) // close .get
;

function _testDateParams(request, response, next) {
    var error = new Error();
    var now = new Date();
    if (request.params.year) {
        if (!utl.isInt(request.params.year)) {
            error.status = 412;
            error.message = "Value "+request.params.year+" is not an integer";
            next(error);
            return;
        }
        if (
            (request.params.year.length !== 4) ||
            (request.params.year > now.getFullYear())
        ) {
            error.status = 412;
            error.message = "Value "+request.params.year+" is not a valid year";
            next(error);
            return;
        }
    } // close if request.params.year

    if (request.params.month) {
        if (!utl.isInt(request.params.month)) {
            error.status = 412;
            error.message = "Value "+request.params.month+" is not an integer";
            next(error);
            return;
        }
        if (
            request.params.month.length !== 2
        ) {
            error.status = 412;
            error.message = "Value "+request.params.month+" is not a valid month";
            next(error);
            return;
        }
    } // close if request.params.month

    if (request.params.day) {
        if (!utl.isInt(request.params.day)) {
            error.status = 412;
            error.message = "Value "+request.params.day+" is not an integer";
            next(error);
            return;
        }
        if (
            request.params.day.length !== 2
        ) {
            error.status = 412;
            error.message = "Value "+request.params.day+" is not a valid day";
            next(error);
            return;
        }
    } // close if request.params.day
    next();
} // close _testDateParams

module.exports = router;
