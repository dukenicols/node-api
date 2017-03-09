//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';

let mongoose = require("mongoose");
let Post = require('../server/api/post/postModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/server');
let should = chai.should();

chai.use(chaiHttp);

// Parent block
describe('Post', () => {
  beforeEach((done) => { // Before each test we empty the database
    Post.remove({}, (err) => {
      done();
    });
  });
  /*
   * Test the /GET Route
   */
  describe('/GET post', () => {
    it('should GET all the categories', (done) => {
      chai.request(server)
        .get('/api/post')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  /*
   * Test the /POST Route
   */
  describe('/POST post', () => {
    it('should not POST a post without title field', (done) => {
      let post = {
        "text": "Angular to is so dope"
      };
      chai.request(server)
        .post('/api/post')
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('title');
          res.body.errors.title.should.have.property('kind').eql('required');
          done();
        });
    });
    it('should not POST a post without text field', (done) => {
      let post = {
        "title": "Learn angular 2 today"
      };
      chai.request(server)
        .post('/api/post')
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('text');
          res.body.errors.text.should.have.property('kind').eql('required');
          done();
        });
    });
    it('should POST a post', (done) => {
      let post = {
        title: "Learn angular 2 today",
        text: "Angular to is so dope",
      };
      chai.request(server)
        .post('/api/post')
        .send(post)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Post successfully added!');
          res.body.post.should.have.property('title').eql('Learn angular 2 today');
          res.body.post.should.have.property('text').eql('Angular to is so dope');
          done();
        });
    });
  });
  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id post', () => {
    it('should GET a post by the given id', (done) => {
      let post = new Post({ title: "Learn angular 2 today",
                            text: "Angular to is so dope"
                          });
      post.save((err, post) => {
        chai.request(server)
          .get('/api/post/' + post.id)
          .send(post)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql('Learn angular 2 today');
            res.body.should.have.property('text').eql('Angular to is so dope');
            res.body.should.have.property('_id').eql(post.id);
            done();
          });
      });
    });
  });
  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id post', () => {
    it('should UPDATE a post by the given id', (done) => {
      let post = new Post({ title: "Learn angular 2 today",
                            text: "Angular to is so dope"
                          });
      post.save((err, post) => {
        chai.request(server)
         .put('/api/post/' + post.id)
         .send({ title: 'Learn React today' })
         .end((err, res) => {
           res.should.have.status(200);
           res.body.should.be.a('object');
           res.body.should.have.property('message').eql('Post updated!');
           res.body.should.have.property('post');
           res.body.post.should.have.property('title').eql('Learn React today');
           res.body.post.should.have.property('text').eql('Angular to is so dope');
           done();
         });
      });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id post', () => {
    it('should DELETE a post by the given id', (done) => {
      let post = new Post({ title: "Learn angular 2 today",
                            text: "Angular to is so dope"
                          });
      post.save((err, post) => {
        chai.request(server)
         .delete('/api/post/' + post.id)
         .end((err, res) => {
           res.should.have.status(200);
           res.body.should.be.a('object');
           res.body.should.have.property('message').eql('Post successfully deleted!');
           res.body.result.should.have.property('_id').eql(post.id);
           done();
         });
      });
    });
    it('should trigger an error on DELETE a post by invalid id, but valid ObjectId', (done) => {
      chai.request(server)
        .delete('/api/post/41224d776a326fb40f000001') // invalid id, validObjectId
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('No post with that id');
          done();
        })
    });
    it('should trigger cast to objectid error on DELETE a post by invalid id', (done) => {
      chai.request(server)
        .delete('/api/post/24242424') // invalid id, validObjectId
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Cast to ObjectId failed for value \"24242424\" at path \"_id\" for model \"post\"');
          done();
        })
    });
  });
});
