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

$(document).ready(function () {
  var NQueensDistributionHandler = function (n) {

    var self = {},
      __self = {};

    __self.n = n;

    __self.init = function () {
      __self.worker = new Worker('dist/worker/worker.js');
      __self.$messages = $('.messages');
      __self.startQueue(0, __self.queueCallback);
      __self.solutions = [];
    };

    __self.queueCallback = function (n, solutionCount) {
      // __self.pushSolutionMessage(n, solutionCount);
      console.log('* queueCallback');
      setTimeout(function () {
        if (n < 6) {
          console.log('* Starting New Queue: ' + (n + 1));
          __self.startQueue(n + 1, __self.queueCallback);
        }
      }, 2000);
    };

    __self.startQueue = function (n, callback) {
      console.log('* Start Queue: ', n);
      if (n === 0 || n === 1) {
        if (typeof callback === 'function') {
          callback(n, 1);
        }
      }
      if (n === 2 || n === 3) {
        if (typeof callback === 'function') {
          callback(n, 0);
        }
      }
      var board = new Board({
        n: n
      });
      __self.solutionCount[n] = 0;

      // Create new NQueensQueueHandler to be executed by the worker
      __self.worker.postMessage({
        jobs: [{
          'rows': board.rows(),
          'rowIndex': 0,
          'n': n
        }],
        solutionCount: 0
      }); // Send data to our worker.
    };

    __self.pushSolutionMessage = function (n, solution) {
      var str = '* Solutions for n == ' + n + ': ' + solution;
      __self.pushMessage(str);
    };

    __self.pushMessage = function (str) {
      var _str = '<div class="message">';
      _str += str;
      _str += '</div>';
      __self.$messages.append(_str);
    };
    __self.init();
    return self;
  };
  var distributionHandler = new NQueensDistributionHandler();
});
},{"./Board":1}]},{},[2])
;