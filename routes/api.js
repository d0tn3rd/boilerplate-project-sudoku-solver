"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const reqBody = req.body;

    if (!reqBody.puzzle || !reqBody.coordinate || !reqBody.value)
      return res.status(400).send({
        error: "Required field(s) missing",
      });

    const result = solver.check(
      reqBody.puzzle,
      reqBody.coordinate,
      reqBody.value,
    );

    console.log("checkResult", result);

    if (result.error) return res.status(400).send({ error: result.error });

    if (reqBody.coordinate.length !== 2)
      return res.status(400).send({ error: "Invalid coordinate" });
    // check the coordinate

    const { error } = solver._validateCoordinates(
      reqBody.coordinate[0],
      reqBody.coordinate[1],
    );

    if (error) return res.status(400).send({ error: "Invalid coordinate" });

    if (!String(reqBody.value).match(/[1-9]{1}/g)) {
      return res.status(400).send({ error: "Invalid value" });
    }

    return res
      .status(200)
      .send({ valid: Boolean(result.valid), conflict: result.conflict });
  });

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
