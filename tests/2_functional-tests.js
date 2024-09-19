const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
/* assert examples */

// var assert = require('chai').assert
//   , foo = 'bar'
//   , beverages = { tea: [ 'chai', 'matcha', 'oolong' ] };
//
// assert.typeOf(foo, 'string'); // without optional message
// assert.typeOf(foo, 'string', 'foo is a string'); // with optional message
// assert.equal(foo, 'bar', 'foo equal `bar`');
// assert.lengthOf(foo, 3, 'foo`s value has a length of 3');
// assert.lengthOf(beverages.tea, 3, 'beverages has 3 types of tea');

suite("Functional Tests", () => {
  suite("solve", () => {
    test("Puzzle solve success", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        })
        .end((err, res) => {
          assert.typeOf(req.body, "object");
          assert.equals(
            req.body.solution,
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378",
          );
          done();
        });
    });

    test("Missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.typeOf(req.body, "object");
          assert.equal(req.body.error, "Required field missing");
          done();
        });
    });

    test("Puzzle with invalid characters", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5...?.9..1....8.2.3674.3.7.2..9.47.-.8..1..16....926914B37.",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.typeOf(req.body, "object");
          assert.equal(req.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Puzzle with greater than 81 characters", (done) => {
      chai
        .request(server)
        .send({
          puzzle:
            "1.5..2.84..63.12.7.2..5...?.9..1....8.2.3674.3.7.2..9.47.-.8..1..16....926914B37.........",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.typeOf(req.body, "object");
          assert.equal(req.body.error, "Expected puzzle to be 81 characters");
          done();
        });
    });

    test("Puzzle with less than 81 characters", (done) => {
      chai
        .request(server)
        .send({
          puzzle: "1.53674.3.7.2..9.47.-.8..1..16....926914B37.........",
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.typeOf(req.body, "object");
          assert.equal(req.body.error, "Expected puzzle to be 81 characters");
          done();
        });
    });

    test("Invalid / cannot be solved", (done) => {
      chai
        .request(server)
        .send({
          //TODO
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.typeOf(req.body, "object");
          assert.equal(req.body.error, "Expected puzzle to be 81 characters");
          done();
        });
    });
  });

  suite("check", () => {
    test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {});
    test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {});
    test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {});
    test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {});
    test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {});
    test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {});
    test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {});
    test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {});
    test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {});
  });
});
