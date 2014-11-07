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