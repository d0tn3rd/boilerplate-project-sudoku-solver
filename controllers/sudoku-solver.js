const REGION_SIZE = 3;

const REGION_START_ROW = 0;

const REGION_START_COL = 0;

const REGION_END_ROW = 2;

const REGION_END_COL = 2;

const REGION_START_ROW_OFFSET = 0;

const REGION_START_COL_OFFSET = 0;
class SudokuSolver {
  validate(puzzleString) {
    const puzzleRegex = /[1-9\.]{81}/;
    const matches = puzzleString.match(puzzleRegex);

    return Boolean(matches);
  }

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {
    const isValidPuzzle = this.validate(puzzleString);
    if (!isValidPuzzle) {
      return "error";
    }
  }
}

module.exports = SudokuSolver;
