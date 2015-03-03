process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../../app'),
    createdBlogData = false,
    userId = "21dbfc670629ed3b226b8b41",
    User = require('../../models/user'),
    fs = require('fs'),
    _authorizedUser = JSON.parse(fs.readFileSync(__dirname + '/../_authorizedUser.json', 'utf8')),
    _authorizedUserToken = ""
;

describe('Requests to the Authentication path', function() {
    describe('Should Return Error', function() {
        it('404 status code with GET', function(done) {
            request(app)
                .get('/api/authenticate')
                .expect(404)
                .end(done);
        });

        it('404 status code with PUT', function(done) {
            request(app)
                .put('/api/authenticate')
                .expect(404)
                .end(done);
        });

        it('404 status code with DELETE', function(done) {
            request(app)
                .delete('/api/authenticate')
                .expect(404)
                .end(done);
        });

        it('400 with POST without emailAddress', function(done) {
            request(app)
                .post('/api/authenticate')
                .send('password=' + _authorizedUser.password)
                .expect(400)
                .end(done);
        });

        it('400 with POST without password', function(done) {
            request(app)
                .post('/api/authenticate')
                .send('emailAddress=' + _authorizedUser.emailAddress)
                .expect(400)
                .end(done);
        });

        it('401 with POST and unknown emailAddress', function(done) {
            request(app)
                .post('/api/authenticate')
                .send('emailAddress=bad-' + _authorizedUser.emailAddress + '&password=' + _authorizedUser.password)
                .expect(401)
                .end(done);
        });

        it('401 with POST and bad password', function(done) {
            request(app)
                .post('/api/authenticate')
                .send('emailAddress=' + _authorizedUser.emailAddress + '&password=bad-' + _authorizedUser.password)
                .expect(401)
                .end(done);
        });

        it('401 with POST and bad password and bad emailAddress', function(done) {
            request(app)
                .post('/api/authenticate')
                .send('emailAddress=bad-' + _authorizedUser.emailAddress + '&password=bad-' + _authorizedUser.password)
                .expect(401)
                .end(done);
        });
    });

    it('Returns a 200 status code with POST and Good Credential Set', function(done) {
        request(app)
            .post('/api/authenticate')
            .send('emailAddress=' + _authorizedUser.emailAddress + '&password=' + _authorizedUser.password)
            .expect(200)
            .end(done);
    });

    it('Returns a Token', function(done) {
        request(app)
            .post('/api/authenticate')
            .send('emailAddress=' + _authorizedUser.emailAddress + '&password=' + _authorizedUser.password)
            .expect(200)
            .expect(function(res) {
                if (!res.body.token) { throw new Error("Expected a Token to be returned"); }
            })
            .end(done);
    });

    it('Returns a Authenticated Users Details', function(done) {
        request(app)
            .post('/api/authenticate')
            .send('emailAddress=' + _authorizedUser.emailAddress + '&password=' + _authorizedUser.password)
            .expect(200)
            .expect(function(res) {
                if (!res.body.user) { throw new Error("Expected a Users Details to be returned"); }
                if (
                    (!res.body.user._id) ||
                    (!res.body.user.firstName) ||
                    (!res.body.user.lastName) ||
                    (!res.body.user.emailAddress)
                ) {
                    throw new Error("Expected Core Users Details to be returned");
                }
                if (
                    (res.body.user._id !== _authorizedUser._id) ||
                    (res.body.user.firstName !== _authorizedUser.firstName) ||
                    (res.body.user.lastName !== _authorizedUser.lastName) ||
                    (res.body.user.emailAddress !== _authorizedUser.emailAddress)
                ) {
                    throw new Error("Expected a Users Details to Match returned Details");
                }
                if (res.body.user.password) {
                    throw new Error("Password should note be returned with User Detials");
                }
            })
            .end(done);
    });
});
