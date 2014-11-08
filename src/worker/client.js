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

    __self.worker.addEventListener('message', , false);

    __self.messageHandler = function (e) {
      var newJobs = e.data.jobs;
      solutionCount += e.data.solutionCount;
      if (newJobs.length > 0) {
        // console.log('Enqueueing More Jobs');
        // setTimeout(function () {
        //   worker.postMessage(newJobs, 0);
        // }, 10000);
      } else {
        console.log('* Done - New N: ' + n + ' / ' + solutionCount);
        // if (typeof callback === 'function') {
        //   callback(n, solutionCount);
        // }
      }
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