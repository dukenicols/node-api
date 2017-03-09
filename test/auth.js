//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';

let mongoose = require('mongoose');
let User = require('../server/api/user/userModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/server');
let should = chai.should();

chai.use(chaiHttp);

// Parent Block
describe('Auth', () => {
  beforeEach((done) => {
    User.remove({}, (err) => {
      done();
    });
  });
  /*
   * Test the /POST Route
   */
   describe('/POST signin', () => {
     it('should Authenticate an user', (done) => {
        let userData = {
          "username": "demo",
          "password": "demopass"
        };
        let user = new User(userData);
        user.save((err, user) => {
          chai.request(server)
            .post('/auth/signin')
            .send(userData)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('token');
              done();
            });
        });
     });
   });
});
