process.env['testing'] = true;

var request = require('supertest'),
    app = require('./../app')
    Article = require('../models/article'),
    Utl = require('../bin/utilities'),

    article1 = {
        _id: "34dbfc6706234d3b226b8b41",
        title: "Blog Post 1",
        publish_date: new Date('2015-03-23 09:15:15'),
        summary: "Test Article 1",
        body: "# Hidy Ho 1"
    },

    article2 = {
        _id: "34dbfc6705434d3b226b8b41",
        title: "Blog Post 2",
        publish_date: new Date('2015-03-23 10:15:15'),
        summary: "Test Article 2",
        body: "# Hidy Ho 2"
    }

    article3 = {
        _id: "34dbfc6705434de3226b8b41",
        title: "Blog Post 3",
        publish_date: new Date('2015-02-13 10:15:15'),
        summary: "Test Article 3",
        body: "# Hidy Ho 3"
    }
;

describe('Blogs Base Path /blog', function() {
    var path = '/blog'

    before(function(done) {
        Article.findByIdAndRemove(article1._id, function() {
            Article.findByIdAndRemove(article2._id, function() {
                Article.findByIdAndRemove(article3._id, function() {
                    Article.create(article1, function() {
                        Article.create(article2, function() {
                            Article.create(article3, function() {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    it('Returns 200 status code', function(done) {
        request(app)
            .get(path)
            .expect(200)
            .end(done)
        ;
    });

    it('Returns HMTL status code', function(done) {
        request(app)
            .get(path)
            .expect('Content-Type', /html/i)
            .end(done)
        ;
    });

    it('Contains Link to Article 1', function(done) {
        request(app)
            .get(path)
            .expect(/href=['"]\/blog\/2015\/03\/23\/blog-post-1['"]/gi)
            .end(done)
        ;
    });

    it('Contains Link to Article 2', function(done) {
        request(app)
            .get(path)
            .expect(/href=['"]\/blog\/2015\/03\/23\/blog-post-2['"]/gi)
            .end(done)
        ;
    });
});


describe('Blogs Path /blog/2015', function() {
    var path = '/blog/2015'

    before(function(done) {
        Article.findByIdAndRemove(article1._id, function() {
            Article.findByIdAndRemove(article2._id, function() {
                Article.findByIdAndRemove(article3._id, function() {
                    Article.create(article1, function() {
                        Article.create(article2, function() {
                            Article.create(article3, function() {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    it('Returns 200 status code', function(done) {
        request(app)
            .get(path)
            .expect(200)
            .end(done)
        ;
    });

    it('Returns HMTL status code', function(done) {
        request(app)
            .get(path)
            .expect('Content-Type', /html/i)
            .end(done)
        ;
    });

    it('Contains Link to Article 1', function(done) {
        request(app)
            .get(path)
            .expect(/href=['"]\/blog\/2015\/03\/23\/blog-post-1['"]/gi)
            .end(done)
        ;
    });

    it('Contains Link to Article 2', function(done) {
        request(app)
            .get(path)
            .expect(/href=['"]\/blog\/2015\/03\/23\/blog-post-2['"]/gi)
            .end(done)
        ;
    });
});


describe('Blogs Path /blog/2015/03', function() {
    var path = '/blog/2015/03'

    before(function(done) {
        Article.findByIdAndRemove(article1._id, function() {
            Article.findByIdAndRemove(article2._id, function() {
                Article.findByIdAndRemove(article3._id, function() {
                    Article.create(article1, function() {
                        Article.create(article2, function() {
                            Article.create(article3, function() {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    it('Returns 200 status code', function(done) {
        request(app)
            .get(path)
            .expect(200)
            .end(done)
        ;
    });

    it('Returns HMTL status code', function(done) {
        request(app)
            .get(path)
            .expect('Content-Type', /html/i)
            .end(done)
        ;
    });

    it('Contains Link to Article 1', function(done) {
        request(app)
            .get(path)
            .expect(/href=['"]\/blog\/2015\/03\/23\/blog-post-1['"]/gi)
            .end(done)
        ;
    });

    it('Contains Link to Article 2', function(done) {
        request(app)
            .get(path)
            .expect(/href=['"]\/blog\/2015\/03\/23\/blog-post-2['"]/gi)
            .end(done)
        ;
    });
});


describe('Blogs Path /blog/2015/03/23', function() {
    var path = '/blog/2015/03/23'

    before(function(done) {
        Article.findByIdAndRemove(article1._id, function() {
            Article.findByIdAndRemove(article2._id, function() {
                Article.findByIdAndRemove(article3._id, function() {
                    Article.create(article1, function() {
                        Article.create(article2, function() {
                            Article.create(article3, function() {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    it('Returns 200 status code', function(done) {
        request(app)
            .get(path)
            .expect(200)
            .end(done)
        ;
    });

    it('Returns HMTL status code', function(done) {
        request(app)
            .get(path)
            .expect('Content-Type', /html/i)
            .end(done)
        ;
    });

    it('Contains Link to Article 1', function(done) {
        request(app)
            .get(path)
            .expect(/href=['"]\/blog\/2015\/03\/23\/blog-post-1['"]/gi)
            .end(done)
        ;
    });

    it('Contains Link to Article 2', function(done) {
        request(app)
            .get(path)
            .expect(/href=['"]\/blog\/2015\/03\/23\/blog-post-2['"]/gi)
            .end(done)
        ;
    });
});


describe('Blogs Path /blog/2015/02/13', function() {
    var path = '/blog/2015/02/13'

    before(function(done) {
        Article.findByIdAndRemove(article1._id, function() {
            Article.findByIdAndRemove(article2._id, function() {
                Article.findByIdAndRemove(article3._id, function() {
                    Article.create(article1, function() {
                        Article.create(article2, function() {
                            Article.create(article3, function() {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    it('Returns 302 status code', function(done) {
        request(app)
            .get(path)
            .expect(302)
            .end(done)
        ;
    });

    it('Returns Correct redirection URL', function(done) {
        request(app)
            .get(path)
            .expect(function(_response) {
                // lets make sure we are redirecting to the place we are expecting
                if (!((path + "/blog-post-3") == _response.header['location'])) {
                    throw new Error("Redirect Location not set Properly");
                }
            })
            .end(done)
        ;
    });
});


describe('Test Invalid Paths', function() {
    var path = '/blog/2015/03/23'

    before(function(done) {
        Article.findByIdAndRemove(article1._id, function() {
            Article.findByIdAndRemove(article2._id, function() {
                Article.findByIdAndRemove(article3._id, function() {
                    Article.create(article1, function() {
                        Article.create(article2, function() {
                            Article.create(article3, function() {
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    it ("Returns 412 with '/blog/2015e/03/23'", function(done) {
        request(app)
            .get('/blog/2015e/03/23')
            .expect(412)
            .end(done)
        ;
    });

    it ("Returns 412 with '/blog/2015/03e/23'", function(done) {
        request(app)
            .get('/blog/2015/03e/23')
            .expect(412)
            .end(done)
        ;
    });

    it ("Returns 412 with '/blog/2015/03/23e'", function(done) {
        request(app)
            .get('/blog/2015/03/23e')
            .expect(412)
            .end(done)
        ;
    });

    it ("Returns 404 with '/blog/2015/03/23/blog-post'", function(done) {
        request(app)
            .get('/blog/2015/03/23/blog-post')
            .expect(404)
            .end(done)
        ;
    });

    it ("Returns 404 with '/blog/2015/03/13/blog-post-1'", function(done) {
        request(app)
            .get('/blog/2015/03/23/blog-post')
            .expect(404)
            .end(done)
        ;
    });

    it ("Returns 404 with '/blog/2015/03/12'", function(done) {
        request(app)
            .get('/blog/2015/03/12')
            .expect(404)
            .end(done)
        ;
    });

    it ("Returns 404 with '/blog/2015/01'", function(done) {
        request(app)
            .get('/blog/2015/01')
            .expect(404)
            .end(done)
        ;
    });

    it ("Returns 404 with '/blog/2013'", function(done) {
        request(app)
            .get('/blog/2013')
            .expect(404)
            .end(done)
        ;
    });

});
