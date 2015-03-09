process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app'),
    utl = require('./../bin/utilities')
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

    it('Returns 404 status code with Random String', function(done) {
        request(app)
            .get( "/" + utl.generatePassword(3,20,false) )
            .expect(404)
            .end(done)
        ;
    });

});
