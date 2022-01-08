const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var firstId;
  test("POST issue with every field", function(done) {
    chai
      .request(server)
      .post("/api/issues/test1")
      .send({
        issue_title: "test",
        issue_text: "test",
        created_by: "test",
        assigned_to: "test",
        status_text: "test"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "_id");
        assert.equal(res.body.issue_title, "test");
        assert.equal(res.body.issue_text, "test");
        assert.equal(res.body.created_by, "test");
        assert.equal(res.body.assigned_to, "test");
        assert.equal(res.body.status_text, "test");
        firstId = res.body._id;
        done();
      });
  });

  test("POST issue with only required fields", function(done) {
    chai
      .request(server)
      .post("/api/issues/test1")
      .send({
        issue_title: "test",
        issue_text: "test",
        created_by: "test",
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, "_id");
        assert.equal(res.body.issue_title, "test");
        assert.equal(res.body.issue_text, "test");
        assert.equal(res.body.created_by, "test");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        done();
      });
  });

  test("POST issue without required fields", function(done) {
    chai
      .request(server)
      .post("/api/issues/test1")
      .send({
        issue_title: "test"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing")
        done();
      });
  });

  test("GET issues", function(done) {
    chai
      .request(server)
      .get("/api/issues/test1")
      .query({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.typeOf(res.body, "array")
        assert.property(res.body[0], "_id");
        assert.property(res.body[0], "issue_title");
        assert.property(res.body[0], "issue_text");
        assert.property(res.body[0], "created_on");
        assert.property(res.body[0], "updated_on");
        assert.property(res.body[0], "created_by");
        assert.property(res.body[0], "assigned_to");
        assert.property(res.body[0], "open");
        assert.property(res.body[0], "status_text");
        done();
      });
  });

  test("GET issues with filter", function(done) {
    chai
      .request(server)
      .get("/api/issues/test1")
      .query({
        open: true
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.typeOf(res.body, "array");
        assert.equal(res.body[0].open, true);
        done();
      });
  });

  test("GET issues with multiple filters", function(done) {
    chai
      .request(server)
      .get("/api/issues/test1")
      .query({
        open: true,
        issue_title: "test"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.typeOf(res.body, "array");
        assert.equal(res.body[0].issue_title, "test");
        assert.equal(res.body[0].open, true);
        done();
      });
  });

  const updateId = "6190a87298f858191d6e70d7";
  test("PUT update one field", function(done) {
    chai
      .request(server)
      .put("/api/issues/test1")
      .send({
        _id: updateId,
        issue_title: "test"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, updateId);
        done();
      });
  });

  test("PUT update multiple fields", function(done) {
    chai
      .request(server)
      .put("/api/issues/test1")
      .send({
        _id: updateId,
        issue_title: "test",
        issue_text: "test"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");
        assert.equal(res.body._id, updateId);
        done();
      });
  });

  test("PUT update without _id", function(done) {
    chai
      .request(server)
      .put("/api/issues/test1")
      .send({
        issue_title: "test"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  test("PUT update without fields", function(done) {
    chai
      .request(server)
      .put("/api/issues/test1")
      .send({
        _id: updateId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");
        assert.equal(res.body._id, updateId);
        done();
      });
  });

  const invalidId = "619090580626e0eba36c0723";
  test("PUT update with invalid _id", function(done) {
    chai
      .request(server)
      .put("/api/issues/test1")
      .send({
        _id: invalidId,
        issue_title: "test"
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, invalidId);
        done();
      });
  });

  test("DELETE issue", function(done) {
    chai
      .request(server)
      .delete("/api/issues/test1")
      .send({
        _id: firstId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, firstId);
        done();
      });
  });

  test("DELETE with invalid _id", function(done) {
    chai
      .request(server)
      .delete("/api/issues/test1")
      .send({
        _id: invalidId
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, invalidId);
        done();
      });
  });

  test("DELETE with without _id", function(done) {
    chai
      .request(server)
      .delete("/api/issues/test1")
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});

/*
Create an issue with every field: POST request to /api/issues/{project}
Create an issue with only required fields: POST request to /api/issues/{project}
Create an issue with missing required fields: POST request to /api/issues/{project}
View issues on a project: GET request to /api/issues/{project}
View issues on a project with one filter: GET request to /api/issues/{project}
View issues on a project with multiple filters: GET request to /api/issues/{project}
Update one field on an issue: PUT request to /api/issues/{project}
Update multiple fields on an issue: PUT request to /api/issues/{project}
Update an issue with missing _id: PUT request to /api/issues/{project}
Update an issue with no fields to update: PUT request to /api/issues/{project}
Update an issue with an invalid _id: PUT request to /api/issues/{project}
Delete an issue: DELETE request to /api/issues/{project}
Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
Delete an issue with missing _id: DELETE request to /api/issues/{project}
*/