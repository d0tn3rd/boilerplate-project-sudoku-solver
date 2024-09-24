const ROW_HEADING = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

class SudokuSolver {
  validate(puzzleString) {
    const puzzleRegex = /[^1-9\.]/gm;

    const puzzleStrCopy = puzzleString;
    const matches = puzzleStrCopy.match(puzzleRegex);

    if (matches) return { error: "Invalid characters in puzzle" };

    if (puzzleString.length !== 81)
      return { error: "Expected puzzle to be 81 characters long" };

    return { error: false }; // no error means success
  }

  isValidPuzzle(puzzleStr) {
    const argArr = puzzleStr.split("");
    // check row, columns and regions for repetition
    const rows = this._calculateRows(argArr);
    const cols = this._calculateColumns(argArr);
    const regions = this._calculateRegions(argArr);

    // check for repetition in each row
    for (const row of rows) {
      const nums = row.filter((x) => x !== ".");
      const numSet = new Set(nums);
      if (nums.length !== numSet.size) {
        return false;
      }
    }
    for (const col of cols) {
      const nums = col.filter((x) => x !== ".");
      const numSet = new Set(nums);
      if (nums.length !== numSet.size) {
        return false;
      }
    }

    for (const region of regions) {
      const nums = region.filter((x) => x !== ".");
      const numSet = new Set(nums);

      if (nums.length !== numSet.size) {
        return false;
      }
    }
    return true;
  }

  check(puzzle, coordinate, value) {
    // serves the /api/check endpoint
    const { error } = this.validate(puzzle);
    if (error) return { error };
    // called after validating coordinates
    const row = coordinate[0];
    const col = coordinate[1];

    const rowIndex = ROW_HEADING.indexOf(row);

    const puzzleStrIndex = 9 * rowIndex + (col - 1);
    console.debug("puzzleStrIndex", puzzleStrIndex);

    console.debug("currently at puzzle", puzzle[puzzleStrIndex]);
    if (puzzle[puzzleStrIndex] !== ".") {
      console.warn("place queried is not empty");
      return {
        error: false,
        valid: puzzle[puzzleStrIndex] === String(value),
      };
    }

    const { valid: rowValid } = this.checkRowPlacement(puzzle, row, col, value);

    const { valid: columnValid } = this.checkColumnPlacement(
      puzzle,
      row,
      col,
      value,
    );
    const { valid: regionValid } = this.checkRegionPlacement(
      puzzle,
      row,
      col,
      value,
    );

    if (columnValid && rowValid && regionValid) {
      return { error: false, valid: true };
    }

    const conflicts = [];
    if (!rowValid) conflicts.push("row");
    if (!columnValid) conflicts.push("column");
    if (!regionValid) conflicts.push("region");
    console.debug("conflicts", conflicts);

    return { error: false, valid: false, conflict: conflicts };
  }

  _validateCoordinates(row, col) {
    // validate row / col values
    if (ROW_HEADING.indexOf(row) === -1) return { error: "Invalid coordinate" };

    const parsedCol = parseInt(col);
    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(parsedCol) === -1)
      return { error: "Invalid coordinate" };
    if (ROW_HEADING.indexOf(row) === -1) {
      return { error: "Invalid coordinate" };
    }
    if (!parsedCol || parsedCol < 1 || parsedCol > 9) {
      return { error: "Invalid coordinate" };
    }

    return { error: false };
  }

  _calculatePuzzleStringIndex(row, col) {
    // return the puzzlestring index for the coordinate
    const rowIndex = ROW_HEADING.indexOf(row);
    return rowIndex * 9 + (col - 1);
  }

  _calculateColumns(argArr) {
    // will return an array of 9 element columns as arrays
    // ideally should be called only once
    // arg array is optional
    const puzzleStrArr = argArr ? argArr : this.puzzleStrArr;
    const cols = [];
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const col = [];
      for (let rowIndex = 0; rowIndex < 81; rowIndex = rowIndex + 9) {
        col.push(puzzleStrArr[rowIndex + colIndex]);
      }
      cols.push(col);
    }

    return cols;
  }

  _calculateRows(argArr) {
    const puzzleStrArr = argArr ? argArr : this.puzzleStrArr;
    const rows = [];
    for (let i = 0; i < 81; i = i + 9) {
      rows.push(puzzleStrArr.slice(i, i + 9));
    }
    return rows;
  }

  _calculateRegions(argArr) {
    const puzzleStrArr = argArr ? argArr : this.puzzleStrArr;
    // choosing the bottom left cell as the anchor
    const regions = [];

    // increasing index
    for (const regionStartIndex of [0, 3, 6, 27, 30, 33, 54, 57, 60]) {
      const region = [];
      for (let rowOffset = 0; rowOffset < 3; rowOffset++) {
        for (let colOffset = 0; colOffset < 3; colOffset++) {
          region.push(
            puzzleStrArr[regionStartIndex + rowOffset * 9 + colOffset],
          );
        }
      }
      regions.push(region);
    }

    return regions;
  }

  _findRegionIndex(puzzleStrIndex) {
    const colIndex = puzzleStrIndex % 9;

    const regionOptions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
    const regionIndex =
      regionOptions[Math.floor(puzzleStrIndex / 27)][Math.floor(colIndex / 3)];

    return regionIndex;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // true if valid false if not
    const { error } = this._validateCoordinates(row, column);
    if (error) return { error, valid: false };
    // validated
    const puzzleRows = this._calculateRows(puzzleString);
    const rowIndex = ROW_HEADING.indexOf(row);

    return {
      error: false,
      valid: puzzleRows[rowIndex].indexOf(String(value)) === -1,
    };
  }

  checkColumnPlacement(puzzleString, row, column, value) {
    const { error } = this._validateCoordinates(row, column);
    if (error) return { error, valid: false };

    const colIndex = column - 1;
    const colsToBeChecked = this._calculateColumns(puzzleString.split(""));
    const targetCol = colsToBeChecked[colIndex];

    return { error: false, valid: targetCol.indexOf(String(value)) === -1 };
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const { error } = this._validateCoordinates(row, column);

    if (error) return { error, valid: false };

    const puzzleStringIndex = this._calculatePuzzleStringIndex(row, column);

    const regionIndex = this._findRegionIndex(puzzleStringIndex);
    const allRegions = this._calculateRegions(puzzleString.split(""));

    const targetRegion = allRegions[regionIndex];

    return { error: false, valid: targetRegion.indexOf(String(value)) === -1 };
  }

  _setDifference(setA, setB) {
    return new Set([...setA].filter((el) => !setB.has(el)));
  }

  _formatPuzzle(puzzleString) {
    let startIndex = 0;
    while (startIndex !== 81) {
      console.debug(
        puzzleString
          .slice(startIndex, startIndex + 9)
          .split("")
          .join(" "),
      );
      startIndex = startIndex + 9;
    }
  }

  findMoves() {
    // find a move
    // assess row by row
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const currentRow = [...this.rows[rowIndex]];

      const rowNums = currentRow.filter((x) => x !== ".");

      // indices of dots in row
      const dotColIndices = currentRow.reduce((aggr, curr, index) => {
        if (curr === ".") {
          aggr.push(index);
        }
        return aggr;
      }, []);

      for (const colIndex of dotColIndices) {
        const currCol = [...this.cols[colIndex]];
        const colNums = currCol.filter((x) => x !== ".");

        const puzzleStrIndex = 9 * rowIndex + colIndex;
        const currRegionIndex = this._findRegionIndex(puzzleStrIndex);

        const currRegion = this.regions[currRegionIndex];

        const regionNums = currRegion.filter((x) => x !== ".");

        // now remove them all from current dot's guessmap
        const aggrSet = new Set(colNums + regionNums + rowNums);

        const newOptions = this._setDifference(
          this.optionMap[puzzleStrIndex],
          aggrSet,
        );

        if (newOptions.size === 1) {
          // found the move, no need to search further
          return { puzzleStrIndex, val: Array.from(newOptions)[0] };
        }
      }
    }

    // nothing found
    return null;
  }

  fillSpot(move) {
    // hello world

    const { puzzleStrIndex, val } = move;

    // remove the key from the map

    console.debug("deleting key", puzzleStrIndex);
    delete this.optionMap[puzzleStrIndex];
    this.puzzleStrArr[puzzleStrIndex] = val;
    this.rows = this._calculateRows();
    this.cols = this._calculateColumns();
    this.regions = this._calculateRegions();
    console.debug("new option map", this.optionMap);
  }

  solve(puzzleString) {
    // validation
    const { error } = this.validate(puzzleString);
    if (error) return { error };

    const isValidPuzzle = this.isValidPuzzle(puzzleString);
    if (!isValidPuzzle) return { error: "Puzzle cannot be solved" };

    // setup

    console.debug("setting up the class");
    this.puzzleStrArr = puzzleString.split("");
    const dotIndices = [...this.puzzleStrArr].reduce((aggr, curr, index) => {
      if (curr === ".") aggr.push(index);
      return aggr;
    }, []);

    const optionMap = dotIndices.reduce((aggr, curr) => {
      aggr[curr] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9].map((el) => String(el)));
      return aggr;
    }, {});

    const puzzleStrArr = [...this.puzzleStrArr];
    this.optionMap = optionMap;
    this.rows = this._calculateRows(puzzleStrArr);
    this.cols = this._calculateColumns(puzzleStrArr);
    this.regions = this._calculateRegions(puzzleStrArr);

    console.debug("Setup complete");
    console.debug("stored option map: ", this.optionMap);

    // find the first move
    let move = this.findMoves();
    while (move) {
      console.debug("applying move: ", move);
      this.fillSpot(move);
      move = this.findMoves();
    }

    if (Object.keys(this.optionMap).length === 0) {
      // solved
      console.debug("solution");
      const soln = this.puzzleStrArr.join("");
      return { error: false, solution: soln };
    } else {
      // all moves applied but still optionMap remains
      return { error: "Puzzle cannot be solved" };
    }
  }
}

module.exports = SudokuSolver;
