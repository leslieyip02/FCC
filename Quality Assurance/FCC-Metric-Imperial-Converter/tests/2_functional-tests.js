const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test("GET request with valid input", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=10L")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.returnNum, 2.64172);
        assert.equal(res.body.returnUnit, "gal");
        done();
      });
  });

  test("GET request with invalid input", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=32g")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, "invalid unit");
        done();
      });
  });

  test("GET request with invalid number", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=3/7.2/4kg")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, "invalid number");
        done();
      });
  });

  test("GET request with invalid number and unit", function(done) {
    chai
      .request(server)
      .get("/api/convert/?input=3/7.2/4kilomegagram")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, "invalid number and unit");
        done();
      });
  });

  test("GET request with no number", function(done) {
    chai
      .request(server)
      .get("/api/convert?input=kg")
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.returnNum, 2.20462);
        assert.equal(res.body.returnUnit, "lbs");
        done();
      });
  });
});

/*
Convert a valid input such as 10L: GET request to /api/convert.
Convert an invalid input such as 32g: GET request to /api/convert.
Convert an invalid number such as 3/7.2/4kg: GET request to /api/convert.
Convert an invalid number AND unit such as 3/7.2/4kilomegagram: GET request to /api/convert.
Convert with no number such as kg: GET request to /api/convert.
*/