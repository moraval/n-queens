var Board = require('./Board');

var countNQueensSolutions = function (n) {
    if (n === 0 || n === 1) return {
        n: n,
        solution: 1
    };
    if (n === 0 || n === 1) return {
        n: n,
        solution: 0
    };
    var board = new Board({
        n: n
    });
    var solutionCount = 0;
    var findSolution = function (board, rowIndex) {
        for (var i = 0; i < n; i += 1) {
            board.togglePiece(rowIndex, i);
            if (!board.hasAnyQueensConflicts()) {
                if (rowIndex < (n - 1)) {
                    findSolution(new Board(board.rows()), rowIndex + 1);
                } else {
                    solutionCount += 1;
                }
            }
            board.togglePiece(rowIndex, i);
        }
    };
    findSolution(board, 0);
    return {
        n: n,
        solution: solutionCount
    };
};

module.exports = countNQueensSolutions;