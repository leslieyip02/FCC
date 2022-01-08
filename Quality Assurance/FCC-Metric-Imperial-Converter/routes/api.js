'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.get("/api/convert", (req, res) => {
    console.log(req.query);

    var initNum, initUnit, returnNum, returnUnit, string;
    initNum = convertHandler.getNum(req.query.input);
    initUnit = convertHandler.getUnit(req.query.input);
    returnNum = convertHandler.convert(initNum, initUnit);
    returnUnit = convertHandler.getReturnUnit(initUnit);
    string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    if (initNum === "invalid number") {
      if (initUnit === "invalid unit") res.json("invalid number and unit");
      res.json("invalid number");
    } else if (initUnit === "invalid unit") {
      res.json("invalid unit");
    } else {
      res.json({
        initNum: initNum,
        initUnit: initUnit,
        returnNum: returnNum,
        returnUnit: returnUnit,
        string: string
      });
    }
  })
};
