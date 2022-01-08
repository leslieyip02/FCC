const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  // Number tests
  test("whole number", function() {
    assert.equal(convertHandler.getNum("1mi"), 1);
  });

  test("decimal number", function() {
    assert.equal(convertHandler.getNum("1.5mi"), 1.5);
  });

  test("fraction", function() {
    assert.equal(convertHandler.getNum("1/2mi"), 0.5)
  });

  test("fraction with decimal numbers", function() {
    assert.equal(convertHandler.getNum("0.5/1mi"), 0.5);
  });

  test("double fraction error", function() {
    assert.equal(convertHandler.getNum("3/2/3mi"), "invalid number");
  });

  test("default to 1", function() {
    assert.equal(convertHandler.getNum("mi"), 1);
  });


  // Unit tests
  test("reading each unit", function() {
    assert.equal(convertHandler.getUnit("1gal"), "gal");
    assert.equal(convertHandler.getUnit("1L"), "L");
    assert.equal(convertHandler.getUnit("1mi"), "mi");
    assert.equal(convertHandler.getUnit("1km"), "km");
    assert.equal(convertHandler.getUnit("1lbs"), "lbs");
    assert.equal(convertHandler.getUnit("1kg"), "kg");
  })
  
  test("invalid unit", function() {
    assert.equal(convertHandler.getUnit("abc"), "invalid unit");
  });

  test("return correct unit", function(){
    assert.equal(convertHandler.getReturnUnit("gal"), "L");
    assert.equal(convertHandler.getReturnUnit("L"), "gal");
    assert.equal(convertHandler.getReturnUnit("mi"), "km");
    assert.equal(convertHandler.getReturnUnit("km"), "mi");
    assert.equal(convertHandler.getReturnUnit("lbs"), "kg");
    assert.equal(convertHandler.getReturnUnit("kg"), "lbs");
  });

  test("correct spelled-out string", function() {
    assert.equal(convertHandler.spellOutUnit("gal"), "gallons");
    assert.equal(convertHandler.spellOutUnit("L"), "liters");
    assert.equal(convertHandler.spellOutUnit("mi"), "miles");
    assert.equal(convertHandler.spellOutUnit("km"), "kilometers");
    assert.equal(convertHandler.spellOutUnit("lbs"), "pounds");
    assert.equal(convertHandler.spellOutUnit("kg"), "kilograms");
  });

  // Conversion tests
  test("gal to L", function() {
    assert.equal(convertHandler.convert("1", "gal"), 3.78541);
    assert.equal(convertHandler.getReturnUnit("gal"), "L")
  });

  test("L to gal", function() {
    assert.equal(convertHandler.convert("1", "L"), 0.26417);
    assert.equal(convertHandler.getReturnUnit("L"), "gal");
  });
  
  test("mi to km", function() {
    assert.equal(convertHandler.convert("1", "mi"), 1.60934);
    assert.equal(convertHandler.getReturnUnit("mi"), "km");
  });

  test("km to mi", function() {
    assert.equal(convertHandler.convert("1", "km"), 0.62137);
    assert.equal(convertHandler.getReturnUnit("km"), "mi");
  });

  test("lbs to kg", function() {
    assert.equal(convertHandler.convert("1", "lbs"), 0.45359);
    assert.equal(convertHandler.getReturnUnit("lbs"), "kg");
  });

  test("kg to lbs", function() {
    assert.equal(convertHandler.convert("1", "kg"), 2.20462);
    assert.equal(convertHandler.getReturnUnit("kg"), "lbs");
  });
});

/*

convertHandler should correctly read a whole number input.
convertHandler should correctly read a decimal number input.
convertHandler should correctly read a fractional input.
convertHandler should correctly read a fractional input with a decimal.
convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3).
convertHandler should correctly default to a numerical input of 1 when no numerical input is provided.
convertHandler should correctly read each valid input unit.
convertHandler should correctly return an error for an invalid input unit.
convertHandler should return the correct return unit for each valid input unit.
convertHandler should correctly return the spelled-out string unit for each valid input unit.
convertHandler should correctly convert gal to L.
convertHandler should correctly convert L to gal.
convertHandler should correctly convert mi to km.
convertHandler should correctly convert km to mi.
convertHandler should correctly convert lbs to kg.
convertHandler should correctly convert kg to lbs.

*/