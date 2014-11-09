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
},{"./Board":1}],3:[function(require,module,exports){
var Board = require('./Board');
var nQueensJobProcessor = require('./nQueensJobProcessor');

/**
 * @param Array[jobObject, ...]
 * @return <object>
 *   jobs: Array[jobObject, ...]
 *   solutionCount: Number
 */
var nQueensJobQueueHandler = function (enqueuedJobs) {
  var solutionCount = {};
  var executedJobCount = 0;
  // Execute 100 jobs MAX
  while (enqueuedJobs.length > 0 && executedJobCount < 100) {
    executedJobCount += 1;
    // Execute the first job in the queue
    var result = nQueensJobProcessor(enqueuedJobs.pop());
    // Concatenate new jobs
    enqueuedJobs = enqueuedJobs.concat(result.jobs);
    // Add the solution to our solution
    if (result.foundSolution === true) {
      if (solutionCount[result.n] === undefined) {
        solutionCount[result.n] = 1;
      } else {
        solutionCount[result.n] += 1;
      }
    }
  }
  return {
    jobCollection: enqueuedJobs,
    solutionCount: solutionCount
  };
};

module.exports = nQueensJobQueueHandler;
},{"./Board":1,"./nQueensJobProcessor":2}],4:[function(require,module,exports){
var Board = require('./classes/Board');
var nQueensJobQueueHandler = require('./classes/nQueensJobQueueHandler');
var nQueensJobProcessor = require('./classes/nQueensJobProcessor');

var countNQueensSolutions = function (n) {
  if (n === 0 || n === 1) return {
    n: n,
    solutionCount: 1
  };
  if (n === 2 || n === 3) return {
    n: n,
    solutionCount: 0
  };
  var board = new Board({
    n: n
  });
  var solutionCount = 0;
  var jobs = [{
    'boardRows': board.rows(),
    'rowIndex': 0,
    'n': n
  }];
  while (jobs.length > 0) {
    var result;
    if (jobs.length > 1) {
      var randomKey = Math.floor(Math.random() * jobs.length);
      var randomJob = jobs.splice(randomKey, 1)[0];
      result = nQueensJobQueueHandler(jobs);
      jobs = result.jobs;
      jobs.push(randomJob);
    } else {
      result = nQueensJobQueueHandler(jobs);
      jobs = result.jobs;
    }
    solutionCount += result.solutionCount;
  }
  return {
    n: n,
    solutionCount: solutionCount
  };
};

module.exports = countNQueensSolutions;
},{"./classes/Board":1,"./classes/nQueensJobProcessor":2,"./classes/nQueensJobQueueHandler":3}],5:[function(require,module,exports){
// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)
var nQueensJobQueueHandler = require('./classes/nQueensJobQueueHandler');
var countNQueensSolutions = require('./countNQueensDistributed');

try {
    if (self !== undefined) {
        /**
         * @param Array[jobObject, ...]
         * @return <object>
         *   jobs: Array[jobObject, ...]
         *   solutionCount: Number
         */
        self.addEventListener('message', function (e) {
            // self.postMessage(countNQueensSolutions(e.data.n));
            var jobCollection = e.data.jobCollection;
            self.postMessage(nQueensJobQueueHandler(jobCollection));
        }, false);
    }
} catch (err) {}
},{"./classes/nQueensJobQueueHandler":3,"./countNQueensDistributed":4}]},{},[5])
;