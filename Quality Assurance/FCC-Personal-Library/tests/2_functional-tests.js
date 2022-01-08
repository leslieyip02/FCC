/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });

  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let tempId;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "test" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "test");
            assert.property(res.body, "_id");
            tempId = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field title");
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let route = "/api/books/" + "618fd489fcf6ea3316c13e06";
        chai
          .request(server)
          .get(route)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        let route = "/api/books/" + tempId.toString();
        chai
          .request(server)
          .get(route)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "test");
            assert.equal(res.body._id, tempId);
            assert.property(res.body, "comments");
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let route = "/api/books/" + tempId.toString();
        chai
          .request(server)
          .post(route)
          .send({ comment: "test" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, "test");
            assert.equal(res.body._id, tempId);
            assert.equal(res.body.comments.pop(), "test");
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        let route = "/api/books/" + tempId.toString();
        chai
          .request(server)
          .post(route)
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing required field comment");
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let route = "/api/books/" + "618fd489fcf6ea3316c13e06";
        chai
          .request(server)
          .post(route)
          .send({ comment: "test" })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        let route = "/api/books/" + tempId.toString();
        chai
          .request(server)
          .delete(route)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "delete successful");
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        let route = "/api/books/" + "618fd489fcf6ea3316c13e06";
        chai
          .request(server)
          .delete(route)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

    });

  });

});
