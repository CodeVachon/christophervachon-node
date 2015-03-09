process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app')
;

describe('Project Path', function() {
    var path = '/projects'
    it('Returns 200 status code', function(done) {
        request(app)
            .get(path)
            .expect(200)
            .end(done)
        ;
    });
});

describe('Old Project Path', function() {
    var path = '/page/projects'
    it('Returns 302 status code', function(done) {
        request(app)
            .get(path)
            .expect(302)
            .expect(function(_response) {
                // lets make sure we are redirecting to the place we are expecting
                if (!(_response.header['location'] == '/projects'))
                    throw new Error("Redirect Location not set Properly");
            })
            .end(done)
        ;
    });
});
