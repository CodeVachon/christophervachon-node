process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app')
;

describe('Project Path', function() {
    var path = '/project'
    it('Returns 404 status code', function(done) {
        request(app)
            .get(path)
            .expect(404)
            .end(done)
        ;
    });
});
