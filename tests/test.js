process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app'),
    User = require('./../models/user'),
    fs = require('fs'),
    _authorizedUser = JSON.parse(fs.readFileSync(__dirname + '/_authorizedUser.json', 'utf8')),
    _unauthorizedUser = JSON.parse(fs.readFileSync(__dirname + '/_unautherizedUser.json', 'utf8'))
;

describe('Initialize the App', function() {

    after(function(done) {
        // Initiate the App First before testing...
        request(app)
            .get('/')
            .expect(200)
            .end(function() {
                setTimeout(done, 1000);
            });
    });

    it('App Is Initialized', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(done);
    });

});

describe('Requests to the root path', function() {

    it('Returns a 200 status code', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .end(done);
    });

    it('Returns a HTML format', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .end(done);
    });

    after(function(done) {
        // We are going to add in article with a specfic id,
        // lets ensure its not there first.
        User.findByIdAndRemove(_authorizedUser._id, function(error) {
            if (error) {
                console.log(error);
            }
            User.create(_authorizedUser, function (error, post) {
                if (error) {
                    console.log(error);
                }
                User.findByIdAndRemove(_unauthorizedUser._id, function(error) {
                    if (error) {
                        console.log(error);
                    }
                    User.create(_unauthorizedUser, function (error, post) {
                        if (error) {
                            console.log(error);
                        }
                        done();
                    });
                });
            });
        });
    });
});

describe("API Tests", function() {
    describe("Authentication Tests", function() { require('./api/authenticaton'); });
    describe("Blog Post Tests", function() { require('./api/posts'); });
    describe("Projects Tests", function() { require('./api/projects'); });
    describe("Users Tests", function() { require('./api/users'); });
});
