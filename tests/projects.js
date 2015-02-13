process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app'),
    createdBlogData = false,
    projectID = "34dbfc670629ed3b226b8b41",
    Project = require('../models/project'),
    fs = require('fs'),
    _authorizedUser = JSON.parse(fs.readFileSync(__dirname + '/_authorizedUser.json', 'utf8'))
;

describe('POST Requests to Projects path', function() {
    before(function(done) {
        // We are going to add in article with a specfic id,
        // lets ensure its not there first.
        Project.findByIdAndRemove(projectID, function(err) {
            if (err) {
                console.log(err);
            }
            done();
        });
    });

    var path = '/api/projects';
    it('Returns a 201 status code', function(done) {
        request(app)
            .post(path)
            .auth(_authorizedUser.emailAddress, _authorizedUser.password)
            .send('_id='+projectID+'&title=Test+Project&summary=Test+Summary')
            .expect(201)
            .expect('Content-Type', /json/i)
            .expect(function(res) {
                if (res.body.title != "Test Project") { throw new Error("Incorrect Title Returned"); }
                if (res.body.summary != "Test Summary") { throw new Error("Incorrect Summary Returned"); }
            })
            .end(done);
    });

    describe('Returns a 400 when', function() {
        it('posting without a Title', function(done) {
            request(app)
                .post(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .send('summary=Test+Summary')
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
                .send('title=Test+Project')
                .expect(400)
                .expect('Content-Type', /json/i)
                .expect(function(res) {
                    if (!res.body.validationerrors) { throw new Error("Expected a Validation Errors"); }
                    if (!res.body.validationerrors.summary) { throw new Error("Expected a Validation Error for Summary"); }
                })
                .end(done);
        });

    });

});

describe('GET Requests to Projects path', function() {
    describe('list path', function() {
        var path = '/api/projects';
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
                    createdBlogData = res.body[0];
                })
                .end(done);
        });
    });

    describe('view path', function() {
        var path = '/api/projects/'+projectID;
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

        it('Returns Test Project', function(done) {
            request(app)
                .get(path)
                .auth(_authorizedUser.emailAddress, _authorizedUser.password)
                .expect(/Test Project/gi)
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

describe('PUT Requests to Projects', function() {
    var path = '/api/projects/'+projectID;
    it('Returns a 202 status code', function(done) {
        request(app)
            .put(path)
            .auth(_authorizedUser.emailAddress, _authorizedUser.password)
            .send('title=Test+Project+Renamed')
            .expect(/Test Project Renamed/i)
            .expect(202)
            .expect('Content-Type', /json/i)
            .expect(function(res) {
                if (res.body.title != "Test Project Renamed") { throw new Error("Incorrect Title Returned"); }
            })
            .end(done);
    });
});

describe('DELETE Requests to Projects', function() {
    var path = '/api/projects/'+projectID;
    it('Returns a 204 status code', function(done) {
        request(app)
            .delete(path)
            .auth(_authorizedUser.emailAddress, _authorizedUser.password)
            .expect(204)
            .end(done);
    });
    it('Project can no longer be found', function(done) {
        request(app)
            .get(path)
            .auth(_authorizedUser.emailAddress, _authorizedUser.password)
            .expect(404)
            .expect('Content-Type', /json/i)
            .end(done);
    });
});
