'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value) return res.json({ error: 'Required field(s) missing' });
      
      let puzzle = req.body.puzzle;
      let x = req.body.coordinate[0].toUpperCase();
      let y = req.body.coordinate[1];
      let value = req.body.value;

      let valid = solver.validate(puzzle);
      if (valid == "wrong length") return res.json({ error: 'Expected puzzle to be 81 characters long' });
      if (valid == "invalid characters") return res.json({ error: 'Invalid characters in puzzle' });

      let validLettersRegex = /[A-Ia-i]/;
      if (!validLettersRegex.test(x) || y < 1 || y > 9 || req.body.coordinate.length > 2) return res.json({ error: 'Invalid coordinate'});
      let validNumbersRegex = /[1-9]/;
      if (!validNumbersRegex.test(value) || value > 9) return res.json({ error: 'Invalid value' });

      let rowCheck = solver.checkRowPlacement(puzzle, x, y, value);
      let colCheck = solver.checkColPlacement(puzzle, x, y, value);
      let regionCheck = solver.checkRegionPlacement(puzzle, x, y, value);

      let conflicts = [];
      if (!rowCheck) conflicts.push("row");
      if (!colCheck) conflicts.push("column");
      if (!regionCheck) conflicts.push("region");

      if (conflicts.length == 0) {
        return res.json({ "valid": true });
      } else {
        return res.json({ "valid": false, conflict: conflicts });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (!puzzle) return res.json({ error: 'Required field missing' });

      let valid = solver.validate(puzzle);
      if (valid == "wrong length") return res.json({ error: 'Expected puzzle to be 81 characters long' });
      if (valid == "invalid characters") return res.json({ error: 'Invalid characters in puzzle' });
      if (valid == "invalid puzzle") return res.json({ error: 'Puzzle cannot be solved' });

      let solutionString = solver.solve(puzzle);
      if (!solutionString) return res.json({ error: 'Puzzle cannot be solved' });

      //console.log(solutionString)
      return res.json({ solution: solutionString })
    });
};
