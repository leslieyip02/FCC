const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzlesAndSolutions = require("../controllers/puzzle-strings");

chai.use(chaiHttp);

let testArr = Object.values(puzzlesAndSolutions)[0];
let testString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

suite('Functional Tests', () => {
  test("valid POST to /api/solve", function(done) {
    console.log(testArr)
    testArr.forEach((arr) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: arr[0] })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.solution, arr[1]);
        });
    });
    done();
  });

  test("POST missing puzzle string to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  test("POST invalid characters to /api/solve", function(done) {
    let invalidCharacterString = "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidCharacterString })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("POST incorrect length to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: "...123..." })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });

  test("POST unsolvable to /api/solve", function(done) {
    let invalidString = "5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidString })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  test("POST to /api/check with all fields", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testString,
        coordinate: "A1",
        value: 7
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test("POST to /api/check with single placement conflict", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testString,
        coordinate: "A1",
        value: 6
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict[0], "column");
        done();
      });
  });

  test("POST to /api/check with multiple placement conflicts", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testString,
        coordinate: "A1",
        value: 9
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });

  test("POST to /api/check with all placement conflicts", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testString,
        coordinate: "A2",
        value: 9
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });

  test("POST to /api/check with missing fields", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("POST to /api/check with invalid characters", function(done) {
    let invalidCharacterString = "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: invalidCharacterString,
        coordinate: "A2",
        value: 9
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("POST to /api/check with incorrect length", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "...123...",
        coordinate: "A2",
        value: 9
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });

  test("POST to /api/check with invalid coordinate", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testString,
        coordinate: "Z0",
        value: 9
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  test("POST to /api/check with invalid value", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: testString,
        coordinate: "A2",
        value: 10
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});

/* 


    Solve a puzzle with valid puzzle string: POST request to /api/solve
    Solve a puzzle with missing puzzle string: POST request to /api/solve
    Solve a puzzle with invalid characters: POST request to /api/solve
    Solve a puzzle with incorrect length: POST request to /api/solve
    Solve a puzzle that cannot be solved: POST request to /api/solve
    Check a puzzle placement with all fields: POST request to /api/check
    Check a puzzle placement with single placement conflict: POST request to /api/check
    Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    Check a puzzle placement with all placement conflicts: POST request to /api/check
    Check a puzzle placement with missing required fields: POST request to /api/check
    Check a puzzle placement with invalid characters: POST request to /api/check
    Check a puzzle placement with incorrect length: POST request to /api/check
    Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    Check a puzzle placement with invalid placement value: POST request to /api/check

*/