class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) return "wrong length";
    
    const validStringRegex = /([1-9\.])/;
    let valid = puzzleString.split("").every(value => validStringRegex.test(value));
    if (!valid) return "invalid characters";

    let puzzleObject = this.convertToObject(puzzleString);
    for (let row in puzzleObject) {
      for (let col in puzzleObject[row]) {
        if (puzzleObject[row][col] != ".") {
          let rowCheck = this.checkRowPlacement("", row, col, puzzleObject[row][col], puzzleObject);
          let colCheck = this.checkColPlacement("", row, col, puzzleObject[row][col], puzzleObject);
          let regionCheck = this.checkRegionPlacement("", row, col, puzzleObject[row][col], puzzleObject);
          if (!rowCheck || !colCheck || !regionCheck) return "invalid puzzle";
        }
      }
    }
    return "solvable";
  }

  convertToObject(puzzleString) {
    let puzzleObject = {};

    let rows = [];
    let stringArr = puzzleString.toString().split("");
    for (let i = 0; i < 9; i ++) {
      let temp = [];
      for (let j = 0; j < 9; j ++) {
        temp.push(stringArr[i * 9 + j]);
      }
      rows.push(temp);
    }
    let characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"]
    rows.forEach((rowArr, i) => {
      let letter = characters[i];
      puzzleObject[letter] = {};
      rowArr.forEach((value, j) => {
        puzzleObject[letter][j + 1] = value;
      });
    });
    //console.log(puzzleObject);
    return puzzleObject;
  }

  checkRowPlacement(puzzleString, x, y, value, objectInput) {
    let puzzleObject;
    if (objectInput) {
      puzzleObject = objectInput;
    } else {
      puzzleObject = this.convertToObject(puzzleString);
    }   

    for (let col in puzzleObject[x]) {
      if (puzzleObject[x][col] == value && col != y) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, x, y, value, objectInput) {
    let puzzleObject;
    if (objectInput) {
      puzzleObject = objectInput;
    } else {
      puzzleObject = this.convertToObject(puzzleString);
    }

    for (let row in puzzleObject) {
      if (puzzleObject[row][y] == value && row != x) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, x, y, value, objectInput) {
    let puzzleObject;
    if (objectInput) {
      puzzleObject = objectInput;
    } else {
      puzzleObject = this.convertToObject(puzzleString);
    }

    let regionObject = {};

    for (let row in puzzleObject) {
      if (row == "A" || row == "B" || row == "C") {
        for (let col in puzzleObject[row]) {
          let region = 1 + Math.floor((col - 1) / 3);
          if (!regionObject.hasOwnProperty(region)) {
            regionObject[region] = [puzzleObject[row][col]];
          } else {
            regionObject[region].push(puzzleObject[row][col]);
          }
        }
      } else if (row == "D" || row == "E" || row == "F") {
        for (let col in puzzleObject[row]) {
          let region = 4 + Math.floor((col - 1) / 3);
          if (!regionObject.hasOwnProperty(region)) {
            regionObject[region] = [puzzleObject[row][col]];
          } else {
            regionObject[region].push(puzzleObject[row][col]);
          }
        }
      } else {
        for (let col in puzzleObject[row]) {
          let region = 7 + Math.floor((col - 1) / 3);
          if (!regionObject.hasOwnProperty(region)) {
            regionObject[region] = [puzzleObject[row][col]];
          } else {
            regionObject[region].push(puzzleObject[row][col]);
          }
        }
      }
    }
    //console.log(regionObject);

    let region;
    if (x == "A" || x == "B" || x == "C") {
      region = 1 + Math.floor((y - 1) / 3);
    } else if (x == "D" || x == "E" || x == "F") {
      region = 4 + Math.floor((y - 1) / 3);
    } else {
      region = 7 + Math.floor((y - 1) / 3);
    }
    if (puzzleObject[x][y] == value) return true;
    return regionObject[region].every(regionValue => regionValue != value);
  }

  solve(puzzleString) {
    let valid = this.validate(puzzleString);
    if (valid != "solvable") return false;
    
    let puzzleObject = this.convertToObject(puzzleString);
    let tempObject = puzzleObject;
    let checkRowPlacement = this.checkRowPlacement.bind(this);
    let checkColPlacement = this.checkColPlacement.bind(this);
    let checkRegionPlacement = this.checkRegionPlacement.bind(this)
    
    let done = false;
    function check(x, y, value) {
      if (x == "J") {
        //console.log(tempObject)
        done = true;
        //console.log("done")
        return tempObject;
      }

      let startingValue;
      if (!value) {
        startingValue = 1;
      } else {
        startingValue = value;
      }

      if (tempObject[x][y] == ".") {
        for (let testValue = startingValue; testValue <= 9; testValue ++) {
          if (done) break;
          let rowCheck = checkRowPlacement("", x, y, testValue, tempObject);
          let colCheck = checkColPlacement("", x, y, testValue, tempObject);
          let regionCheck = checkRegionPlacement("", x, y, testValue, tempObject);

          if (rowCheck && colCheck && regionCheck && !done) {
            tempObject[x][y] = testValue;
            //console.log(tempObject)
            let newX = x;
            let newY = y;
            if (y == 9) {
              newX = String.fromCharCode(x.charCodeAt(0) + 1);
              newY = 0;
            }
            newY ++;
            check(newX, newY);
          } else if (testValue == 9 && !done) {
            let oldX, oldY;
            function findPrevious(currentX, currentY) {
              let previousX = currentX;
              let previousY = currentY - 1;
              if (previousY == 0) {
                previousX = String.fromCharCode(previousX.charCodeAt(0) - 1);
                previousY = 9;
                for (let col in tempObject[currentX]) {
                  if (typeof tempObject[currentX][col] == "number") {
                    tempObject[currentX][col] = ".";
                  }
                }
              }
              //console.log(previousX, previousY)
              if (typeof tempObject[previousX][previousY] == "string" || tempObject[previousX][previousY] == ".") {
                findPrevious(previousX, previousY);
              } else {
                oldX = previousX;
                oldY = previousY;
              }
            }
            findPrevious(x, y);
            //console.log(oldX, oldY);
            if (oldX == "@") break;
            let newStarterValue = tempObject[oldX][oldY] + 1;
            tempObject[oldX][oldY] = ".";
            //console.log(tempObject)
            return check(oldX, oldY, newStarterValue);
          }
        }
      } else if (!done) {
        if (y == 9) {
          x = String.fromCharCode(x.charCodeAt(0) + 1);
          y = 0;
        }
        y ++;
        check(x, y);
      }
      if (done) return true;
      return false;
    }
    let solved = check("A", "1");
    //console.log(solved);
    let solutionArr = [];
    for (let row in tempObject) {
      for (let col in tempObject[row]) {
        solutionArr.push(tempObject[row][col]);
      }
    }
    let solutionString = solutionArr.join("");
    //console.log(solutionString);
    if (solved) {
      return solutionString;
    } else {
      return false;
    }
  }
}

module.exports = SudokuSolver;

