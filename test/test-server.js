var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    it('should serve static files on GET', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
    
    // it('should ', function(done) {
    //     chai.request()
    //         .get()
    //         .end(function(err, res) {
                
    //             done();
    //     });
    // });
});