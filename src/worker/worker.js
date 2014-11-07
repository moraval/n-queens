// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)
var NQueensJobQueueHandler = require('./NQueensJobQueueHandler');
try {
    if (self !== undefined) {
        self.addEventListener('message', function (e) {
            self.postMessage(new NQueensJobQueueHandler(e.data.n));
        }, false);
    }
} catch (err) {}

try {
    if (module !== undefined && module.exports !== undefined) {
        module.exports = __self;
    }
} catch (err) {}