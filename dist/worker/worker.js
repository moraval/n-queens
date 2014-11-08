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

var Board = function (params) {
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
    hasRowConflictAt: function (row) {
      var counter = 0;

      for (var i = 0; i < row.length; ++i) {
        if (row[i] === 1)++counter;
        if (counter > 1) break;
      }

      return counter > 1;
    },
    hasAnyRowConflicts: function () {
      var rows = obj.rows();

      for (var i = 0; i < rows.length; ++i) {
        if (obj.hasRowConflictAt(rows[i])) {
          return true;
        }
      }

      return false;
    },
    hasColConflictAt: function (colIndex, rows) {
      var counter = 0;

      for (var i = 0; i < rows.length; ++i) {
        if (rows[i][colIndex] === 1)++counter;
        if (counter > 1) break;
      }

      return counter > 1;
    },
    hasAnyColConflicts: function () {
      var rows = obj.rows();

      for (var i = 0; i < rows.length; ++i) {
        if (obj.hasColConflictAt(i, rows)) {
          return true;
        }
      }

      return false;
    },
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
    hasAnyMajorDiagonalConflicts: function () {
      var n = obj.get('n');

      for (var i = 0; i < n; ++i) {
        if (obj.hasMajorDiagonalConflictAt(i, 0)) {
          return true;
        }
      }

      for (var ii = 0; ii < n; ++ii) {
        if (obj.hasMajorDiagonalConflictAt(0, ii)) {
          return true;
        }
      }

      return false;
    },
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
  };
  obj.initialize(params);
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
var nQueensJobProcessor = function (board, rowIndex, n) {
  var foundSolution = false;
  var jobs = [];

  this.board = board;
  this.rowIndex = rowIndex;
  this.jobs = [];
  this.executed = false;
  this.n = n;
  this.foundSolution = false;
};

NQueensJob.prototype.getID = function () {
  return this.board.getID();
};

NQueensJob.prototype.getArgsArray = function () {
  return [this.board.rows(), this.rowIndex, this.n, this.foundSolution];
};

NQueensJob.prototype.execute = function () {
  if (this.rowIndex === this.n) {
    this.solutionCount += 1;
    return;
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
var Board = require('./Board');
var NQueensJob = require('./NQueensJob');

var NQueensJobQueueHandler = function (jobsArrays) {
  this.jobs = [];
  var that = this;
  jobsArrays.forEach(function (job) {
    that.jobs.push(new NQueensJob(new Board(job.rows), job.rowIndex, job.n));
  });
  this.solutionCount = 0;
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
  var jobsArrays = this.jobs.map(function (job) {
    return job.getArgsArray();
  });
  return {
    jobs: jobsArrays,
    solutionCount: this.solutionCount
  };
};

NQueensJobQueueHandler.prototype.executeSingleJob = function (job) {
  var jobResult = job.execute();
  this.jobs = this.jobs.concat(jobResult.jobs);
  this.solutionCount += jobResult.solutionCount;
};

module.exports = NQueensJobQueueHandler;
},{"./Board":1,"./NQueensJob":2}],4:[function(require,module,exports){
// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)
var NQueensJobQueueHandler = require('./NQueensJobQueueHandler');
var NQueensJob = require('./NQueensJob');
var Board = require('./Board');
try {
    if (self !== undefined) {
        self.addEventListener('message', function (e) {
            var jobCollection = e.data.jobs;
            var solutionCount = e.data.solutionCount;
            var queue = new NQueensJobQueueHandler(jobCollection, solutionCount);
            self.postMessage(queue.execute());
        }, false);
    }
} catch (err) {}

try {
    if (module !== undefined && module.exports !== undefined) {
        module.exports = __self;
    }
} catch (err) {}
},{"./Board":1,"./NQueensJob":2,"./NQueensJobQueueHandler":3}]},{},[4])
;