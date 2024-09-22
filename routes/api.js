"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {});

  app.route("/api/solve").post((req, res) => {
    if (!req.body.puzzle) {
      return res.status(400).send({
        error: "Required field missing",
      });
    }

    const puzzleString = req.body.puzzle;

    const result = solver.validate(puzzleString);

    if (result.error) return res.status(400).send({ error: result.error });

    const solved = solver.solve(puzzleString);

    if (solved.error) return res.status(400).send({ error: solved.error });

    return res.status(200).send({ solution: solved.solution });
  });
};
