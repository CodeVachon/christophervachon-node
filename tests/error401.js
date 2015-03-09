process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app')
;

describe('Project Path', function() {

    it('Returns 401 status code on "/api/users"', function(done) {
        request(app)
            .get('/api/users')
            .expect(401)
            .end(done)
        ;
    });

    it('Returns 401 status code on "/api/projects"', function(done) {
        request(app)
            .get('/api/projects')
            .expect(401)
            .end(done)
        ;
    });

    it('Returns 401 status code on "/api/posts"', function(done) {
        request(app)
            .get('/api/posts')
            .expect(401)
            .end(done)
        ;
    });

});
