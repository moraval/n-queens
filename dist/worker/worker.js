;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var range = function (start, stop, step) {
  if (arguments.length <= 1) {
    stop = start || 0;
    start = 0;
  }
  step = arguments[2] || 1;

  var len = Math.max(Math.ceil((stop - start) / step), 0);
  var idx = 0;
  var range = new Array(len);

  while (idx < len) {
    range[idx++] = start;
    start += step;
  }
  return range;
};

var Board = function (arraryOrN) {
  var obj = {
    attributes: {},
    set: function (key, value) {
      obj.attributes[key] = value;
    },
    get: function (key) {
      return obj.attributes[key];
    },
    initialize: function (params) {
      if (params.hasOwnProperty('n')) {
        obj.set('n', params.n);
        for (var i = 0; i < params.n; i += 1) {
          obj.set(i, makeEmptyArray(params.n));
        }
      } else {
        for (var ii = 0; ii < params.length; ii += 1) {
          obj.set(ii, params[ii]);
        }
        obj.set('n', params.length);
      }
    },
    rows: function () {
      var clonedArray = [];
      range(obj.get('n')).forEach(function (rowIndex) {
        clonedArray.push(obj.get(rowIndex).slice());
      });
      return clonedArray;
    },
    togglePiece: function (rowIndex, colIndex) {
      obj.get(rowIndex)[colIndex] = +!obj.get(rowIndex)[colIndex];
    },
    hasAnyRooksConflicts: function () {
      return obj.hasAnyRowConflicts() || obj.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        obj.hasRowConflictAt(rowIndex) ||
        obj.hasColConflictAt(colIndex) ||
        obj.hasMajorDiagonalConflictAt(rowIndex, colIndex) ||
        obj.hasMinorDiagonalConflictAt(rowIndex, colIndex)
      );
    },

    hasAnyQueensConflicts: function () {
      return obj.hasAnyRooksConflicts() || obj.hasAnyMajorDiagonalConflicts() || obj.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function (rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < obj.get('n') &&
        0 <= colIndex && colIndex < obj.get('n')
      );
    },


    /*
    _             _     _
___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
/ __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
\__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
|___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

*/
    /*=========================================================================
=                 TODO: fill in these Helper Functions                    =
=========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on obj board contains a conflict
    hasRowConflictAt: function (row) {
      var counter = 0;

      for (var i = 0; i < row.length; ++i) {
        if (row[i] === 1)++counter;
        if (counter > 1) break;
      }

      return counter > 1;
    },

    // test if any rows on obj board contain conflicts
    hasAnyRowConflicts: function () {
      var rows = obj.rows();

      for (var i = 0; i < rows.length; ++i) {
        if (obj.hasRowConflictAt(rows[i])) {
          return true;
        }
      }

      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on obj board contains a conflict
    hasColConflictAt: function (colIndex, rows) {
      var counter = 0;

      for (var i = 0; i < rows.length; ++i) {
        if (rows[i][colIndex] === 1)++counter;
        if (counter > 1) break;
      }

      return counter > 1;
    },

    // test if any columns on obj board contain conflicts
    hasAnyColConflicts: function () {
      var rows = obj.rows();

      for (var i = 0; i < rows.length; ++i) {
        if (obj.hasColConflictAt(i, rows)) {
          return true;
        }
      }

      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on obj board contains a conflict
    hasMajorDiagonalConflictAt: function (rowIndex, colIndex) {
      var rows = obj.rows();
      var counter = 0;

      var rowIdx = rowIndex;
      var colIdx = colIndex;

      while (obj._isInBounds(rowIdx, colIdx)) {
        if (rows[rowIdx][colIdx] === 1)++counter;
        if (counter > 1) break;

        ++rowIdx;
        ++colIdx;
      }

      return counter > 1;

      rowIdx = rowIndex;
      colIdx = colIndex;
      counter = 0;

      while (obj._isInBounds(rowIdx, colIdx)) {
        if (rows[rowIdx][colIdx] === 1)++counter;
        if (counter > 1) break;

        --rowIdx;
        --colIdx;
      }

      return counter > 1;
    },

    // test if any major diagonals on obj board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      var n = obj.get('n');

      for (var i = 0; i < n; ++i) {
        if (obj.hasMajorDiagonalConflictAt(i, 0)) {
          return true;
        }
      }

      for (var i = 0; i < n; ++i) {
        if (obj.hasMajorDiagonalConflictAt(0, i)) {
          return true;
        }
      }

      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on obj board contains a conflict
    hasMinorDiagonalConflictAt: function (rowIndex, colIndex) {
      var rows = obj.rows();
      var counter = 0;

      var rowIdx = rowIndex;
      var colIdx = colIndex;

      while (obj._isInBounds(rowIdx, colIdx)) {
        if (rows[rowIdx][colIdx] === 1)++counter;
        if (counter > 1) break;
        ++rowIdx;
        --colIdx;
      }

      if (counter > 1) {
        return true;
      }

      rowIdx = rowIndex;
      colIdx = colIndex;
      counter = 0;

      while (obj._isInBounds(rowIdx, colIdx)) {
        if (rows[rowIdx][colIdx] === 1)++counter;
        if (counter > 1) break;

        --rowIdx;
        ++colIdx;
      }

      if (counter > 1) {
        return true;
      }
    },

    // test if any minor diagonals on obj board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {
      var n = obj.get('n');
      for (var i = 0; i < n; ++i) {
        if (obj.hasMinorDiagonalConflictAt(i, n - 1)) {
          return true;
        }
      }
      for (var ii = 0; ii < n; ii += 1) {
        if (obj.hasMinorDiagonalConflictAt(0, ii)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/

  };
  obj.initialize(arraryOrN);
  return obj;
};
var makeEmptyMatrix = function (n) {
  return range(n).map(function () {
    return makeEmptyArray(n);
  });
};
var makeEmptyArray = function (n) {
  return range(n).map(function () {
    return 0;
  });
};
module.exports = Board;
},{}],2:[function(require,module,exports){
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
},{"./Board":1}],3:[function(require,module,exports){
var NQueensJobQueueHandler = function (jobs, solutionCount) {
  this.jobs = jobs;
  this.solutionCount = solutionCount;
};

NQueensJobQueueHandler.prototype.getJobCount = function () {
  return this.jobs.length;
};

NQueensJobQueueHandler.prototype.execute = function () {
  while (this.jobs.length > 0 || this.jobCount < 100) {
    // Execute the first job in the queue
    this.executeSingleJob(this.jobs[0]);
    // Remove this job once it's done
    this.jobs.splice(0, 1);
  }
  return {
    jobs: this.jobs,
    solutionCount: this.solutionCount
  };
};

NQueensJobQueueHandler.prototype.executeSingleJob = function (job) {
  var jobResult = job.execute();
  this.jobs = this.jobs.concat(jobResult.jobs);
  this.solutionCount += jobResult.solutionCount;
};

module.exports = NQueensJobQueueHandler;
},{}],4:[function(require,module,exports){
var Board = require('./Board');
var NQueensJobQueueHandler = require('./NQueensJobQueueHandler');
var NQueensJob = require('./NQueensJob');

var countNQueensSolutions = function (n) {
    if (n === 0 || n === 1) return {
        n: n,
        solution: 1
    };
    if (n === 2 || n === 3) return {
        n: n,
        solution: 0
    };
    var board = new Board({
        n: n
    });
    var solutionCount = 0;
    var queue = new NQueensJobQueueHandler(
        [new NQueensJob(new Board(board.rows()), 0, n)],
        0
    );
    while (queue.getJobCount() > 0) {
        queue.execute();
    }
    return {
        n: n,
        solution: queue.solutionCount
    };
};

module.exports = countNQueensSolutions;
},{"./Board":1,"./NQueensJob":2,"./NQueensJobQueueHandler":3}],5:[function(require,module,exports){
// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

var __self = {};
__self.Board = require('./Board');
__self.countNQueensSolutions = require('./countNQueensDistributed');

try {
    if (self !== undefined) {
        self.addEventListener('message', function (e) {
            self.postMessage(__self.countNQueensSolutions(e.data));
        }, false);
    }
} catch (err) {}

try {
    if (module !== undefined && module.exports !== undefined) {
        module.exports = __self;
    }
} catch (err) {}
},{"./Board":1,"./countNQueensDistributed":4}]},{},[5])
;