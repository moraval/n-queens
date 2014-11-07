// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

var __self = {};
__self.Board = require('./Board');
__self.countNQueensSolutions = require('./countNQueensDistributed');

try {
    if (self !== undefined) {
        self.addEventListener('message', function (e) {
            self.postMessage(__self.countNQueensSolutions(e.data));
        }, false);
    }
} catch (err) {}

try {
    if (module !== undefined && module.exports !== undefined) {
        module.exports = __self;
    }
} catch (err) {}