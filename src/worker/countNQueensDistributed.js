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