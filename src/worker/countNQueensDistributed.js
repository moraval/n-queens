var Board = require('./Board');
var NQueensJobQueueHandler = require('./NQueensJobQueueHandler');
var NQueensJob = require('./NQueensJob');

var countNQueensSolutions = function (n) {
    if (n === 0 || n === 1) return {
        n: n,
        solution: 1
    };
    if (n === 2 || n === 3) return {
        n: n,
        solution: 0
    };
    var board = new Board({
        n: n
    });
    var solutionCount = 0;
    var queue = new NQueensJobQueueHandler(
        [new NQueensJob(new Board(board.rows()), 0, n)],
        0
    );
    while (queue.getJobCount() > 0) {
        queue.execute();
    }
    return {
        n: n,
        solution: queue.solutionCount
    };
};

module.exports = countNQueensSolutions;