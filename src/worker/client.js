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