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