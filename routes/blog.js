var express = require('express'),
    router = express.Router(),
    Posts = require("./../models/article"),
    utl = require("./../bin/utilities"),
    // Use the same MarkDown as the Admin Editor...
    Showdown = require("./../public/admin/js/vendor/showdown"),
    converter = new Showdown.converter({ extensions: ['table','github','gist'] }),
    itemsPerPage = 5,
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
;

router.route('/')
    .get(function(request, response) {

        var pageNo = request.query.page || 1;
        var _endDate = new Date();

        Posts.find({
            "publish_date": {
                $lt: _endDate
            }
        }, null, {limit: itemsPerPage, skip: (pageNo-1)*itemsPerPage, sort: {publish_date: -1}},function (errors, posts) {
            Posts.count({
                "publish_date": {
                    $lt: _endDate
                }
            }, function(error, count) {
                response.render('blogList', {
                    posts: posts,
                    utl: utl,
                    paging: _pagingVariables(count, itemsPerPage, pageNo),
                    pageTitle: "Blog Posts",
                    pageDescription: "List of all of the blog posts by Christopher Vachon"
                });
            }); // close Posts.count
        }); // close Posts.find
    }) // close get
;
router.route('/tags/:tagname')
    .get(function(request, response, next) {
        var pageNo = request.query.page || 1;
        var _endDate = new Date();

        Posts.find({
            "publish_date": {
                $lt: _endDate
            },
            tags: request.params.tagname
        }, null, {limit: itemsPerPage, skip: (pageNo-1)*itemsPerPage, sort: {publish_date: -1}}, function (errors, posts) {
            if (posts.length) {
                Posts.count({
                    "publish_date": {
                        $lt: _endDate
                    },
                    tags: request.params.tagname
                }, function(error, count) {
                    response.render('blogList', {
                        posts: posts,
                        utl: utl,
                        paging: _pagingVariables(count, itemsPerPage, pageNo),
                        pageTitle: " Blog Posts - Tag: " + request.params.tagname,
                        pageDescription: "List of all " + request.params.tagname + " blog posts by Christopher Vachon"
                    });
                }); // close Posts.count
            } else {
                var error = new Error();
                error.status = 404;
                error.message = "No Articles Found Matching " + request.params.tagname;
                next(error);
                return;
            }
        }); // close Posts.find

    }) // close get
;
router.route('/:year')
    .get(_testDateParams, function(request, response, next) {

        var _startDate = new Date('Jan 1 ' + request.params.year + ' 00:00:00');
        var _endDate = new Date('Dec 31 ' + request.params.year + ' 23:59:59');

        var _now = new Date();
        if (_endDate > _now) {
            _endDate = _now;
        }

        var pageNo = request.query.page || 1;

        Posts.find({
            "publish_date": {
                $gt: _startDate,
                $lt: _endDate
            }
        }, null, {limit: itemsPerPage, skip: (pageNo-1)*itemsPerPage, sort: {publish_date: -1}}, function(error, posts) {
            if (error) {
                error.status = 500;
                next(error);
            } else {
                if (posts.length > 0) {
                    Posts.count({"publish_date": {
                        $gt: _startDate,
                        $lt: _endDate
                    }}, function(error, count) {
                        response.render('blogList', {
                            posts: posts,
                            utl: utl,
                            paging: _pagingVariables(count, itemsPerPage, pageNo),
                            pageTitle: "Blog Posts " + _startDate.getFullYear(),
                            pageDescription: "A list of all of the blog posts in "  + _startDate.getFullYear() + " by Christopher Vachon"
                        });
                    }); // close Posts.count
                } else {
                    var error = new Error();
                    error.status = 404;
                    error.message = "Articles Not Found";
                    next(error);
                    return;
                }
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

        var _now = new Date();
        if (_endDate > _now) {
            _endDate = _now;
        }

        var pageNo = request.query.page || 1;

        Posts.find({
            "publish_date": {
                $gt: _startDate,
                $lt: _endDate
            }
        }, null, {limit: itemsPerPage, skip: (pageNo-1)*itemsPerPage, sort: {publish_date: -1}}, function(error, posts) {
            if (error) {
                error.status = 500;
                next(error);
            } else {
                if (posts.length > 0) {
                    Posts.count({"publish_date": {
                        $gt: _startDate,
                        $lt: _endDate
                    }}, function(error, count) {
                        response.render('blogList', {
                            posts: posts,
                            utl: utl,
                            paging: _pagingVariables(count, itemsPerPage, pageNo),
                            pageTitle: "Blog Posts " + months[_startDate.getMonth()] + " " + _startDate.getFullYear(),
                            pageDescription: "A list of all of the blog posts in " + months[_startDate.getMonth()] + " " + _startDate.getFullYear() + " by Christopher Vachon"
                        });
                    }); // close Posts.count
                } else {
                    var error = new Error();
                    error.status = 404;
                    error.message = "Articles Not Found";
                    next(error);
                    return;
                }
            }
        }); // close Post.fine
    }) // close .get
;
router.route('/:year/:month/:day')
    .get(_testDateParams, function(request, response, next) {
        var _startDate = new Date();
        _startDate.setFullYear(request.params.year);
        _startDate.setMonth( parseInt(request.params.month)-1 );
        _startDate.setDate( parseInt(request.params.day) );
        _startDate.setHours(0);
        _startDate.setMinutes(0);
        _startDate.setSeconds(0);

        var _endDate = new Date(_startDate);
        _endDate.setDate(_endDate.getDate()+1);

        var _now = new Date();
        if (_endDate > _now) {
            _endDate = _now;
        }

        var pageNo = request.query.page || 1;

        Posts.find({
            "publish_date": {
                $gt: _startDate,
                $lt: _endDate
            }
        }, null, {limit: itemsPerPage, skip: (pageNo-1)*itemsPerPage, sort: {publish_date: -1}}, function(error, posts) {

            if (error) {
                console.log(error);
                error.status = 500;
                next(error);
                return;
            } else {

                if (posts.length > 1) {
                    Posts.count({"publish_date": {
                        $gt: _startDate,
                        $lt: _endDate
                    }}, function(error, count) {
                        response.render('blogList', {
                            posts: posts,
                            utl: utl,
                            paging: _pagingVariables(count, itemsPerPage, pageNo),
                            pageTitle: "Blog Posts " + months[_startDate.getMonth()] + " " + _startDate.getDate() + " "+ _startDate.getFullYear(),
                            pageDescription: "A list of all of the blog posts in " + months[_startDate.getMonth()] + " " + _startDate.getDate() + " "+ _startDate.getFullYear()  + " by Christopher Vachon"
                        });
                    }); // close Posts.count
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

        var _startDate = new Date();
        _startDate.setFullYear(request.params.year);
        _startDate.setMonth( parseInt(request.params.month)-1 );
        _startDate.setDate( parseInt(request.params.day) );
        _startDate.setHours(0);
        _startDate.setMinutes(0);
        _startDate.setSeconds(0);

        var _endDate = new Date(_startDate);
        _endDate.setDate(_endDate.getDate()+1);

        Posts.findOne({
            "publish_date": {
                $gt: _startDate,
                $lt: _endDate
            },
            "safeurl": request.params.title
        }, function(error, post) {
            if (error) {
                error.status = 500;
                next(error);
            } else {
                if (post) {
                    response.render('blogView', {
                        post: post,
                        postBody: converter.makeHtml(post.body).replace(/\<img src/gi,"<img class='img-responsive' src"),
                        utl: utl,
                        pageTitle: post.title,
                        pageDescription: post.summary
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

function _pagingVariables(totalCount, itemsPerPage, pageNo) {
    var _padding = 3;
    var _totalPages = Math.ceil(totalCount / itemsPerPage);
    var _prevPageNo = ((pageNo>1)?parseInt(pageNo)-1:1);
    var _nextPageNo = ((pageNo<_totalPages)?parseInt(pageNo)+1:_totalPages);
    var _startingPageNo = parseInt(pageNo)-_padding;
    if (_startingPageNo < 1) { _startingPageNo = 1; }
    var _endingPageNo = _startingPageNo+(_padding*2);
    if (_endingPageNo > _totalPages) {
        _endingPageNo = _totalPages;
        _startingPageNo = _endingPageNo-(_padding*2);
        if (_startingPageNo < 1) { _startingPageNo = 1; }
    }

    return {
        prevPageNo: _prevPageNo,
        nextPageNo: _nextPageNo,
        currentPageNo: pageNo,
        maxPageNo: _totalPages,
        itemsPerPage: itemsPerPage,
        startingPageNo: _startingPageNo,
        endingPageNo: _endingPageNo
    };
} // close _pagingVariables

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
