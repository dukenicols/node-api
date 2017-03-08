//During the test the env variable is set to test
process.env.NODE_ENV = 'testing';

let mongoose = require("mongoose");
let Category = require('../server/api/category/categoryModel');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/server');
let should = chai.should();

chai.use(chaiHttp);

// Parent block
describe('Category', () => {
  beforeEach((done) => { // Before each test we empty the database
    Category.remove({}, (err) => {
      done();
    });
  });

  /*
   * Test the /GET Route
   */
  describe('/GET category', () => {
    it('should GET all the categories', (done) => {
      chai.request(server)
        .get('/api/category')
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
  describe('/POST category', () => {
    it('should not POST a category without name field', (done) => {
      let category = {};
      chai.request(server)
        .post('/api/category')
        .send(category)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('name');
          res.body.errors.name.should.have.property('kind').eql('required');
          done();
        });
    });
    it('should POST a category', (done) => {
      let category = {
        name: 'Test Category'
      };
      chai.request(server)
        .post('/api/category')
        .send(category)
        .end((err, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Category successfully added!');
          res.body.category.should.have.property('name').eql('Test Category');
          done();
        });
    });
  });
  /*
   * Test the /GET/:id route
   */
  describe('/GET/:id category', () => {
    it('should GET a category by the given id', (done) => {
      let category = new Category({ name: 'Test Category' });
      category.save((err, category) => {
        chai.request(server)
          .get('/api/category/' + category.id)
          .send(category)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Test Category');
            res.body.should.have.property('_id').eql(category.id);
            done();
          });
      });
    });
  });
  /*
   * Test the /PUT/:id route
   */
  describe('/PUT/:id category', () => {
    it('should UPDATE a category by the given id', (done) => {
      let category = new Category({ name: 'Test Categury' });
      category.save((err, category) => {
        chai.request(server)
         .put('/api/category/' + category.id)
         .send({ name: 'Test Category' })
         .end((err, res) => {
           res.should.have.status(200);
           res.body.should.be.a('object');
           res.body.should.have.property('message').eql('Category updated!');
           res.body.should.have.property('category');
           res.body.category.should.have.property('name').eql('Test Category');
           done();
         });
      });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id category', () => {
    it('should DELETE a category by the given id', (done) => {
      let category = new Category({ name: 'Test Category' });
      category.save((err, category) => {
        chai.request(server)
         .delete('/api/category/' + category.id)
         .end((err, res) => {
           res.should.have.status(200);
           res.body.should.be.a('object');
           res.body.should.have.property('message').eql('Category successfully deleted!');
           res.body.result.should.have.property('_id').eql(category.id);
           done();
         });
      });
    });
  });

})
