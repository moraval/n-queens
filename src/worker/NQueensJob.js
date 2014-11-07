var Board = require('./Board');
// NQueensJob (Board, N)
// return solutionCount, jobs
var NQueensJob = function (board, rowIndex, n) {
  this.board = board;
  this.rowIndex = rowIndex;
  this.jobs = [];
  this.executed = false;
  this.n = n;
  this.solutionCount = 0;
};

NQueensJob.prototype.getID = function () {
  return this.board.getID();
};

NQueensJob.prototype.execute = function () {
  if (this.rowIndex === this.n) {
    this.solutionCount += 1;
    return {
      solutionCount: this.solutionCount,
      jobs: []
    };
  }
  for (var i = 0; i < this.n; i += 1) {
    this.board.togglePiece(this.rowIndex, i);
    if (!this.board.hasAnyQueensConflicts()) {
      this.jobs.push(
        new NQueensJob(
          new Board(this.board.rows()),
          this.rowIndex + 1,
          this.n
        )
      );
    }
    this.board.togglePiece(this.rowIndex, i);
  }
  this.exeucted = true;
  return {
    solutionCount: this.solutionCount,
    jobs: this.jobs
  };
};

module.exports = NQueensJob;