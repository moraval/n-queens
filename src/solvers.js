/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

window.deepCopy = function(array) {
  return _.map(array, function(x) {
    return x.slice();
  });
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  var board = new Board({n: n});
  var solution = null;

  var findSolution = function(rowIndex) {
    if (solution) return;

    for (var i = 0; i < n; ++i) {
      board.togglePiece(rowIndex, i);

      if (!board.hasAnyRooksConflicts() ) {
        if (rowIndex < (n - 1) ) {
          findSolution(rowIndex + 1);
        } else {
          solution = deepCopy(board.rows() );
        }
      }

      board.togglePiece(rowIndex, i);
    }
  };

  findSolution(0);
  return solution || new Board({n:n}).rows();
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var board = new Board({n: n});
  var solutionCount = 0;

  var findSolution = function(rowIndex) {
    for (var i = 0; i < n; ++i) {
      board.togglePiece(rowIndex, i);

      if (!board.hasAnyRooksConflicts() ) {
        if (rowIndex < (n - 1) ) {
          findSolution(rowIndex + 1);
        } else {
          ++solutionCount;
        }
      }

      board.togglePiece(rowIndex, i);
    }
  };

  findSolution(0);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  if (n === 2 || n === 3) {
    return new Board({n:n}).rows();
  }

  var board = new Board({n: n});
  var solution = null;

  var findSolution = function(rowIndex) {
    if (solution) return;

    for (var i = 0; i < n; ++i) {
      board.togglePiece(rowIndex, i);

      if (!board.hasAnyQueensConflicts() ) {
        if (rowIndex < (n - 1) ) {
          findSolution(rowIndex + 1);
        } else {
          solution = deepCopy(board.rows() );
        }
      }

      board.togglePiece(rowIndex, i);
    }
  };

  findSolution(0);
  return solution || new Board({n:n}).rows();
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if (n === 2 || n === 3) {
    return 0;
  }

  var board = new Board({n: n});
  var solutionCount = 0;

  var findSolution = function(rowIndex) {
    for (var i = 0; i < n; i += 1) {
      board.togglePiece(rowIndex, i);

      if (!board.hasAnyQueensConflicts() ) {
        if (rowIndex < (n - 1) ) {
          findSolution(rowIndex + 1);
        } else {
          console.log('Solution');
          console.log(JSON.stringify(deepCopy(board.rows())));
          solutionCount += 1;
        }
      }

      board.togglePiece(rowIndex, i);
    }
  };

  findSolution(0);
  return solutionCount;
};
