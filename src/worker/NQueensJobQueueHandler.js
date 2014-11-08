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