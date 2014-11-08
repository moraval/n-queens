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