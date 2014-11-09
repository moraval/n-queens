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