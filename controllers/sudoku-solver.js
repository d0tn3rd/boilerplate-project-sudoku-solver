const ROW_HEADING = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
class SudokuSolver {
  validate(puzzleString) {
    const puzzleRegex = /[1-9\.]{81}/;
    const matches = puzzleString.match(puzzleRegex);

    if (puzzleString.length !== 81)
      return { error: "Expected puzzle to be 81 characters long" };

    if (!matches) return { error: "Invalid characters in puzzle" };

    return { error: false, success: true };
  }

  _validateCoordinates(row, col) {
    // validate row / col values
    if (ROW_HEADING.indexOf(row) === -1) return { error: "Invalid coordinate" };

    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(column) === -1)
      return { error: "Invalid coordinate" };
    if (ROW_HEADING.indexOf(row) === -1) {
      return { error: "Invalid coordinate" };
    }
    const parsedCol = parseInt(col);
    if (!parsedCol) {
      return { error: "Invalid coordinate" };
    }
    if (parsedCol < 1 || parsedCol > 9) {
      return { error: "Invalid coordinate" };
    }
  }

  _calculateRowIndices(row) {
    // this function returns the current row's indices on the puzzlestring
    // convert to indices for calculation
    const rowIndex = ROW_HEADING.indexOf(row);
    // we throw away the col

    const rowIndices = [];
    for (let i = 0; i < 9; i++) {
      rowIndices.push(9 * rowIndex + i);
    }

    return rowIndices;
  }

  _calculateColumnIndices(col) {
    // return current columns indinces on the puzzlestring
    const colIndex = col - 1;
    const colIndices = [];
    for (let i = 0; i < 9; i++) {
      colIndices.push(9 * i + colIndex);
    }
  }

  _calculateRegionIndices(row, col) {
    // calculate region's indices no the puzzleString
    const rowIndex = ROW_HEADING.indexOf(row);
    const colIndex = parseInt(col) - 1;
    const rowStart = Math.floor(rowIndex / 3);
    const regionMultiplier = Math.Floor(colIndex / 3);
    const regionOffset = regionMultiplier * 3;
    const regionIndices = [];
    for (let i = 0; i < 3; i++) {
      // column wise
      for (let j = 0; j < 3; j++) {
        regionIndices.push(9 * (rowStart + j) + regionOffset + i);
      }
    }

    return regionIndices;
  }

  _calculatePuzzleStringIndex(row, col) {
    // return the puzzlestring index for the coordinate
    const rowIndex = ROW_HEADING.indexOf(row);
    return rowIndex * 9 + col - 1;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const { error } = this._validateCoordinates(row, column);
    if (error) return { error };

    // find row indices
    const rowIndices = this._calculateRowIndices(row, column);
    const rowVals = rowIndices.map((index) => puzzleString[index]);
    if (rowVals.indexOf(value) !== -1) {
      return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const { error } = this._validateCoordinates(row, column);
    if (error) return { error };

    // find col indices
    const colIndices = this._calculateColumnIndices(row, column);
    const colVals = colIndices.map((index) => puzzleString[index]);
    return colVals.indexOf(value !== -1);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // assume val is string
    const { error } = this._validateCoordinates(row, column);
    if (error) return { error };

    const regionIndices = this._calculateRegionIndices(row, column);
    const regionVals = regionIndices.map((index) => puzzleString[index]);
    return regionVals.indexOf(value) !== -1;
  }

  solve(puzzleString) {
    const { error } = this.validate(puzzleString);
    if (error) return { error };
  }
}

module.exports = SudokuSolver;
