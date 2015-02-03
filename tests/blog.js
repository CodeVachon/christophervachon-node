var request = require('supertest'),
    app = require('./../app')
;

describe('Post Request to Blog Path', function() {
    var path = '/blog';
    it('Returns a 201 status code', function(done) {
        request(app)
            .post(path)
            .send('title=Test+Article&summary=Test+Summary&body=Test+Body')
            .expect(/Test Article/i)
            .expect(201)
            .expect('Content-Type', /json/i)
            .end(done);
    });

    describe('Returns a 400 when', function() {
        it('posting without a Title', function(done) {
            request(app)
                .post(path)
                .send('summary=Test+Summary&body=Test+Body')
                .expect(400)
                .expect('Content-Type', /json/i)
                .end(done);
        });

        it('posting without a Summary', function(done) {
            request(app)
                .post(path)
                .send('title=Test+Article&body=Test+Body')
                .expect(400)
                .expect('Content-Type', /json/i)
                .end(done);
        });

        it('posting without a Body', function(done) {
            request(app)
                .post(path)
                .send('title=Test+Article&summary=Test+Summary')
                .expect(400)
                .expect('Content-Type', /json/i)
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
    });

    describe('view path', function() {
        var path = '/blog/0';
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

        it('Returns Test Article', function(done) {
            request(app)
                .get(path)
                .expect(/Test Article/gi)
                .end(done);
        });
    });
});
