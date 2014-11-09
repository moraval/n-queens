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
var Board = require('./classes/Board');

$(document).ready(function () {
  var NQueensDistributionHandler = function (n) {

    var self = {},
      __self = {};

    __self.n = n;

    __self.init = function () {
      __self.workers = [];
      __self.numberOfWorkers = 4;
      for (var i = 0; i < __self.numberOfWorkers; i += 1) {
        __self.workers.push(new Worker('dist/worker/worker.js'));
      }
      __self.$messages = $('.messages');
      __self.$solutions = $('.solutions');
      __self.n = 4;
      __self.nQueueStarted = {};
      __self.startQueue(__self.n);
      __self.solutionCount = {};
      __self.queueTimerInterval = null;
      for (var ii = 0; ii < 4; ii += 1) {
        __self.workers[ii].addEventListener('message', __self.messageHandler, false);
      }
    };

    __self.messageHandler = function (e) {
      var jobCollection = e.data.jobCollection;
      var solutionCount = e.data.solutionCount;
      for (var n in solutionCount) {
        if (__self.solutionCount[n] === undefined) {
          __self.solutionCount[n] = 0;
        }
        __self.solutionCount[n] += solutionCount[n];
        __self.pushMessage('Appending ' + solutionCount[n] + ' new solutions for  ' + n);
        clearTimeout(__self.queueTimerInterval);
        __self.queueTimerInterval = setTimeout(__self.queueTimer.bind(null, +n + 1), 1000);
      }
      if (jobCollection.length > 0) {
        __self.pushMessage('Enqueueing ' + jobCollection.length + ' new jobs');
        var splitJobCollection = __self.splitArrayInForWorkers(jobCollection);
        for (var i = 0; i < __self.numberOfWorkers; i += 1) {
          if (splitJobCollection[i].length > 0) {
            __self.workers[i].postMessage({
              jobCollection: splitJobCollection[i]
            });
          }
        }
      }
    };

    __self.queueTimer = function (n) {
      if (window.continueQueue !== false) {
        if (__self.nQueueStarted[n] === undefined) {
          __self.pushSolutionMessage(n - 1, __self.solutionCount[+n - 1]);
          __self.pushMessage('Starting new queue: ' + n);
          console.log('Solution for N (', +n - 1, '): ' + __self.solutionCount[+n - 1]);
          console.log('Starting new queue: ' + n);
          __self.nQueueStarted[n] = {
            'started': true
          };
          __self.startQueue(n);
        }
      }
    };

    __self.startQueue = function (n) {
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
      var jobCollection = [{
        'boardRows': board.rows(),
        'rowIndex': 0,
        'n': n,
        'id': Math.floor(Math.random() * 10000)
      }];
      __self.workers[0].postMessage({
        jobCollection: jobCollection
      });
    };

    __self.splitArrayInForWorkers = function (array) {
      var arrayCopy = array.slice();
      var oneFourth = Math.max(1, Math.floor(array.length / __self.numberOfWorkers));
      var splitArray = [];
      for (var i = 0; i < __self.numberOfWorkers; i += 1) {
        if (i === __self.numberOfWorkers - 1) {
          splitArray.push(arrayCopy.splice(0, arrayCopy.length));
        } else {
          splitArray.push(arrayCopy.splice(0, oneFourth));
        }
      }
      return splitArray;
    };

    __self.pushSolutionMessage = function (n, solution) {
      var str = 'Solution for n == ' + n + ': ' + solution;
      __self.pushMessage(str, ['solution'], true);
    };

    __self.pushMessage = function (str, classes, isSolution) {
      classes = classes || [];
      isSolution = isSolution || false;
      classes.push('message');
      var _str = '<div class="' + classes.join(' ') + '">';
      _str += str;
      _str += '</div>';
      if (isSolution === true) {
        __self.$messages.html('');
        __self.$solutions.prepend(_str);
      }
      __self.$messages.prepend(_str);
    };

    __self.init();
    return self;
  };
  var distributionHandler = new NQueensDistributionHandler();
});
},{"./classes/Board":1}]},{},[2])
;