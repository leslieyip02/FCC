const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let testString = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

suite('UnitTests', () => {
  test("81 valid characters", function() {
    assert.equal(solver.validate(testString), "solvable");
  });

  test("invalid characters", function() {
    let invalidCharacterString = "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.validate(invalidCharacterString), "invalid characters");
  });

  test("not 81 characters", function() {
    assert.equal(solver.validate("..123..."), "wrong length");
  });

  test("valid row placement", function() {
    assert.equal(solver.checkRowPlacement(testString, "A", "1", 7), true);
  });

  test("invalid row placement", function() {
    assert.equal(solver.checkRowPlacement(testString, "A", "2", 9), false);
  });

  test("valid col placement", function() {
    assert.equal(solver.checkColPlacement(testString, "A", "1", 7), true);
  });

  test("invalid col placement", function() {
    assert.equal(solver.checkColPlacement(testString, "A", "2", 9), false);
  });

  test("valid region placement", function() {
    assert.equal(solver.checkRegionPlacement(testString, "A", "1", 7), true);
  });

  test("invalid region placement", function() {
    assert.equal(solver.checkRegionPlacement(testString, "A", "2", 9), false);
  });

  test("valid string passes through solver", function() {
    assert.notEqual(solver.solve(testString), false);
  });

  test("invalid string fails solver", function() {
    let invalidString = "5.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.solve(invalidString), false);
  });

  test("solver solves valid string", function() {
    let solutionString = "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
    assert.equal(solver.solve(testString), solutionString);
  });
});

/*

    Logic handles a valid puzzle string of 81 characters
    Logic handles a puzzle string with invalid characters (not 1-9 or .)
    Logic handles a puzzle string that is not 81 characters in length
    Logic handles a valid row placement
    Logic handles an invalid row placement
    Logic handles a valid column placement
    Logic handles an invalid column placement
    Logic handles a valid region (3x3 grid) placement
    Logic handles an invalid region (3x3 grid) placement
    Valid puzzle strings pass the solver
    Invalid puzzle strings fail the solver
    Solver returns the expected solution for an incomplete puzzle

*/