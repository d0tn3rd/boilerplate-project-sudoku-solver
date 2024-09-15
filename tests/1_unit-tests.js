const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", (done) => {
    assert.equal(
      solver.solve(
        "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1",
      ),
      "218396745753284196496157832531672984649831257827549613962415378185763429374928561",
    );
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Logic handles a valid row placement", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Logic handles an invalid row placement", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Logic handles a valid column placement", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Logic handles an invalid column placement", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Logic handles a valid region (3x3 grid) placement", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Logic handles an invalid region (3x3 grid) placement", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Valid puzzle strings pass the solver", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Invalid puzzle strings fail the solver", (done) => {
    assert.equal(solver.solve(""), "");
  });
  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    assert.equal(solver.solve(""), "");
  });
});
