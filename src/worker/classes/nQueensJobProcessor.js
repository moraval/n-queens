var Board = require('./Board');
/**
 * @param <jobObject>
 *   board: Matrix
 *   rowIndex: Number
 *   n: Number
 * @return <object>
 *   foundSolution: Boolean
 *   rowIndex: Number
 *   n: Number
 *   jobs: Array[jobObject]
 */
var nQueensJobProcessor = function (jobObject) {
  var boardRows = jobObject.boardRows;
  var rowIndex = jobObject.rowIndex;
  var n = jobObject.n;

  var board = new Board(boardRows);
  var foundSolution = false;
  var jobs = [];

  if (rowIndex === n) {
    foundSolution = true;
  } else {
    for (var i = 0; i < n; i += 1) {
      board.togglePiece(rowIndex, i);
      if (!board.hasAnyQueensConflicts()) {
        jobs.push({
          boardRows: board.rows(),
          rowIndex: rowIndex + 1,
          n: n,
          id: Math.floor(Math.random() * 10000)
        });
      }
      board.togglePiece(rowIndex, i);
    }
  }
  return {
    foundSolution: foundSolution,
    rowIndex: rowIndex,
    n: n,
    jobs: jobs
  };
};

module.exports = nQueensJobProcessor;