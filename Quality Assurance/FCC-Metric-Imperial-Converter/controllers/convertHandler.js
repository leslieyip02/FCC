function ConvertHandler() {
  
  this.getNum = function(input) {
    var result = input.replace(/[A-Za-z]+$/, "");
    if (result.indexOf("/") != result.lastIndexOf("/")) return "invalid number";
    if (!result) return 1;

    if (result.includes("/")) {
      var index = result.indexOf("/");
      var firstHalf = result.substring(0, index);
      var secondHalf = result.substring(index + 1);
      result = parseFloat(firstHalf) / parseFloat(secondHalf);
    }

    return parseFloat(result);
  };
  
  this.getUnit = function(input) {
    var result = input.replace(/[\d\/\.]*/g, "").toLowerCase();
    
    switch(result) {
      case "gal":
        return result;
      case "l":
        return "L";
      case "mi":
        return result;
      case "km":
        return result;
      case "lbs":
        return result;
      case "kg":
        return result;
      default:
        return "invalid unit";
    }
  };
  
  this.getReturnUnit = function(initUnit) {
    switch(initUnit) {
      case "gal":
        return "L";
      case "L":
        return "gal";
      case "mi":
        return "km";
      case "km":
        return "mi";
      case "lbs":
        return "kg";
      case "kg":
        return "lbs";
      default:
        return "invalid unit";
    }
  };

  this.spellOutUnit = function(unit) {
    switch(unit) {
      case "gal":
        return "gallons";
      case "L":
        return "liters";
      case "mi":
        return "miles";
      case "km":
        return "kilometers";
      case "lbs":
        return "pounds";
      case "kg":
        return "kilograms";
      default:
        return "invalid unit";
    }
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    var result;
    switch(initUnit) {
      case "gal":
        result = initNum * galToL;
        break;
      case "L":
        result = initNum / galToL;
        break;
      case "mi":
        result = initNum * miToKm;
        break;
      case "km":
        result = initNum / miToKm;
        break;
      case "lbs":
        result =  initNum * lbsToKg;
        break;
      case "kg":
        result =  initNum / lbsToKg;
        break;
      default:
        return result = 0;
    }

    return parseFloat(result.toFixed(5));
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    let result = `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`
    return result;
  };
  
}

module.exports = ConvertHandler;
