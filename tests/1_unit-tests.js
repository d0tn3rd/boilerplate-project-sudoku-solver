const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", (done) => {
    const result = solver.solve(
      "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
    );
    assert.equal(
      result.solution,
      "218396745753284196496157832531672984649831257827549613962415378185763429374928561",
    );
    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
    assert.equal(
      solver.solve(
        "..839.7.575.....964..1+......16.29846.9.312.7..754.....62..5.78.8...3.2-..492...1",
      )["error"],
      "Invalid characters in puzzle",
    );
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    assert.equal(
      solver.solve(
        "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78...492...1",
      )["error"],
      "Expected puzzle to be 81 characters long",
    );
    done();
  });

  test("Logic handles a valid row placement", (done) => {
    assert.isFalse(
      solver.checkRowPlacement(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "A",
        2,
        3,
      )["error"],
    );
    done();
  });

  test("Logic handles an invalid row placement", (done) => {
    assert.isTrue(
      solver.checkRowPlacement(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "A",
        2,
        8,
      )["error"],
    );
    done();
  });

  test("Logic handles a valid column placement", (done) => {
    assert.isFalse(
      solver.checkColumnPlacement(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "A",
        2,
        3,
      )["error"],
    );
    done();
  });

  test("Logic handles an invalid column placement", (done) => {
    assert.isTrue(
      solver.checkColumnPlacement(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "A",
        2,
        9,
      )["error"],
    );
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", (done) => {
    assert.isFalse(
      solver.checkRegionPlacement(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "A",
        2,
        3,
      )["error"],
    );
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", (done) => {
    assert.isTrue(
      solver.checkRegionPlacement(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        "A",
        2,
        1,
      )["error"],
    );
    done();
  });

  test("Valid puzzle strings pass the solver", (done) => {
    // read all the strings from examples and deploy here
    assert.isFalse(
      solver.solve(
        "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      )["error"],
    );
    done();
  });

  test("Invalid puzzle strings fail the solver", (done) => {
    assert.equal(
      solver.solve(
        "125..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
      )["error"],
      "Puzzle cannot be solved",
    );
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    assert.equal(
      solver.solve(
        "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
      )["solution"],
      "218396745753284196496157832531672984649831257827549613962415378185763429374928561",
    );
    done();
  });
});
