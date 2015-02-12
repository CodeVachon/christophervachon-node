process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app'),
    createdBlogData = false,
    articleID = "54dbfc670629ed3b226b8b41",
    Article = require('../models/article')
;

describe('Post Request to Blog Path', function() {
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

    var path = '/blog';
    it('Returns a 201 status code', function(done) {
        request(app)
            .post(path)
            .send('_id='+articleID+'&title=Test+Article&summary=Test+Summary&body=Test+Body')
            .expect(/Test Article/i)
            .expect(201)
            .expect('Content-Type', /json/i)
            .expect(function(res) {
                if (res.body.title != "Test Article") { throw new Error("Incorrect Title Returned"); }
                createdBlogData = res.body;
            })
            .end(done);
    });

    describe('Returns a 400 when', function() {
        it('posting without a Title', function(done) {
            request(app)
                .post(path)
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

describe('Get Request to Blog', function() {
    describe('list path', function() {
        var path = '/blog';
        it('Returns a 200 status code', function(done) {
            request(app)
                .get(path)
                .expect(200)
                .end(done);
        });

        it('Returns JSON', function(done) {
            request(app)
                .get(path)
                .expect('Content-Type', /json/i)
                .end(done);
        });

        it('Returns JSON Array', function(done) {
            request(app)
                .get(path)
                .expect(function(res) {
                    if (typeof(res.body) == "Array") { throw new Error("Expected an Array"); }
                    createdBlogData = res.body[0];
                })
                .end(done);
        });
    });

    describe('view path', function() {
        var path = '/blog/'+articleID;
        it('Returns a 200 status code ['+path+']', function(done) {
            request(app)
                .get(path)
                .expect(200)
                .end(done);
        });

        it('Returns JSON', function(done) {
            request(app)
                .get(path)
                .expect('Content-Type', /json/i)
                .end(done);
        });

        it('Returns JSON Object', function(done) {
            request(app)
                .get(path)
                .expect(function(res) {
                    if (typeof(res.body) == "Object") { throw new Error("Expected an Object"); }
                })
                .end(done);
        });

        it('Returns Test Article', function(done) {
            request(app)
                .get(path)
                .expect(/Test Article/gi)
                .end(done);
        });

        it('Returns 404 when invalid ID is passed', function(done) {
            request(app)
                .get(path.replace(/4/g,'6'))
                .expect(404)
                .end(done);
        });
    });
});
