process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app')
;
require('it-each')();

describe('API paths', function() {
    var apiPaths = [
        '/api/users',
        '/api/projects',
        '/api/posts'
    ];

    it.each(apiPaths, 'Returns 401 status code on API Paths', ['path'], function(path, done) {
        request(app)
            .get(path)
            .expect(401)
            .end(done)
        ;
    });

});
