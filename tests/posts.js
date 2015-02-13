process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app'),
    createdBlogData = false,
    articleID = "54dbfc670629ed3b226b8b41",
    Article = require('../models/article'),
    fs = require('fs'),
    _authorizedUser = JSON.parse(fs.readFileSync(__dirname + '/_authorizedUser.json', 'utf8'))
;

describe('POST Request to Posts Path', function() {
    before(function(done) {
        // We are going to add in article with a specfic id,
        // lets ensure its not there first.
        Article.findByIdAndRemove(articleID, function(err) {
            if (err) {
                console.log(err);
            }
            done();
        });
    });

    var path = '/api/posts';
    it('Returns a 201 status code', function(done) {
        request(app)
            .post(path)
            .auth(_authorizedUser.emailAddress, _authorizedUser.password)
            .send('_id='+articleID+'&title=Test+Article&summary=Test+Summary&body=Test+Body')
            .expect(/Test Article/i)
            .expect(201)
            .expect('Content-Type', /json/i)
            .expect(function(res) {
                if (res.body.title != "Test Article") { throw new Error("Incorrect Title Returned"); }
                if (res.body.summary != "Test Summary") { throw new Error("Incorrect Summary Returned"); }
                if (res.body.body != "Test Body") { throw new Error("Incorrect Body Returned"); }
                if (res.body.safeurl != "test-article") { throw new Error("Incorrect SafeURL Returned"); }
            })
            .end(done);
    });

    describe('Returns a 400 when', function() {
        it('posting without a Title', function(done) {
            request(app)
                .post(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .send('summary=Test+Summary&body=Test+Body')
                .expect(400)
                .expect('Content-Type', /json/i)
                .expect(function(res) {
                    if (!res.body.validationerrors) { throw new Error("Expected a Validation Errors"); }
                    if (!res.body.validationerrors.title) { throw new Error("Expected a Validation Error for Title"); }
                })
                .end(done);
        });

        it('posting without a Summary', function(done) {
            request(app)
                .post(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .send('title=Test+Article&body=Test+Body')
                .expect(400)
                .expect('Content-Type', /json/i)
                .expect(function(res) {
                    if (!res.body.validationerrors) { throw new Error("Expected a Validation Errors"); }
                    if (!res.body.validationerrors.summary) { throw new Error("Expected a Validation Error for Summary"); }
                })
                .end(done);
        });

        it('posting without a Body', function(done) {
            request(app)
                .post(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .send('title=Test+Article&summary=Test+Summary')
                .expect(400)
                .expect('Content-Type', /json/i)
                .expect(function(res) {
                    if (!res.body.validationerrors) { throw new Error("Expected a Validation Errors"); }
                    if (!res.body.validationerrors.body) { throw new Error("Expected a Validation Error for Body"); }
                })
                .end(done);
        });
    });

});

describe('GET Requests to Posts', function() {
    describe('list path', function() {
        var path = '/api/posts';
        it('Returns a 200 status code', function(done) {
            request(app)
                .get(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect(200)
                .end(done);
        });

        it('Returns JSON', function(done) {
            request(app)
                .get(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect('Content-Type', /json/i)
                .end(done);
        });

        it('Returns JSON Array', function(done) {
            request(app)
                .get(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect(function(res) {
                    if (typeof(res.body) == "Array") { throw new Error("Expected an Array"); }
                })
                .end(done);
        });
    });

    describe('view path', function() {
        var path = '/api/posts/'+articleID;
        it('Returns a 200 status code ['+path+']', function(done) {
            request(app)
                .get(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect(200)
                .end(done);
        });

        it('Returns JSON', function(done) {
            request(app)
                .get(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect('Content-Type', /json/i)
                .end(done);
        });

        it('Returns JSON Object', function(done) {
            request(app)
                .get(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect(function(res) {
                    if (typeof(res.body) == "Object") { throw new Error("Expected an Object"); }
                })
                .end(done);
        });

        it('Returns Test Article', function(done) {
            request(app)
                .get(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect(/Test Article/gi)
                .end(done);
        });

        it('Returns 404 when invalid ID is passed', function(done) {
            request(app)
                .get(path.replace(/4/g,'6'))
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect(404)
                .end(done);
        });
    });
});

describe('PUT Requests to Posts', function() {
    var path = '/api/posts/'+articleID;
    it('Returns a 202 status code', function(done) {
        request(app)
            .put(path)
            .auth(_authorizedUser.emailAddress, _authorizedUser.password)
            .send('title=Test+Article+Renamed')
            .expect(/Test Article Renamed/i)
            .expect(202)
            .expect('Content-Type', /json/i)
            .expect(function(res) {
                if (res.body.title != "Test Article Renamed") { throw new Error("Incorrect Title Returned"); }
                if (res.body.safeurl != "test-article-renamed") { throw new Error("Incorrect SafeURL Returned -- expected [test-article-renamed] got ["+res.body.safeurl+"]"); }
                if (typeof(res.body.safeurl_history) === "Array") { throw new Error("Expected SafeURL_History to be an Array"); }
                if (res.body.safeurl_history[0] != "test-article") { throw new Error("Incorrect SafeURL_History[0] Returned -- expected [test-article] got ["+res.body.safeurl_history[0]+"]"); }
            })
            .end(done);
    });
});

describe('DELETE Requests to Posts', function() {
    var path = '/api/posts/'+articleID;
    it('Returns a 204 status code', function(done) {
        request(app)
            .delete(path)
            .auth(_authorizedUser.emailAddress, _authorizedUser.password)
            .expect(204)
            .end(done);
    });
    it('Post can no longer be found', function(done) {
        request(app)
            .get(path)
            .auth(_authorizedUser.emailAddress, _authorizedUser.password)
            .expect(404)
            .expect('Content-Type', /json/i)
            .end(done);
    });
});
