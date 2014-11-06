// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {

  var Board = function (arraryOrN) {
    var obj = {
      attributes: {},
      set: function (key, value) {
        obj.attributes[key] = value;
      },
      get: function (key) {
        return obj.attributes[key];
      },
      initialize: function (params) {
        if (params.hasOwnProperty('n')) {
          obj.set('n', params.n);
          for (var i = 0; i < params.n; i += 1) {
            obj.set(i, makeEmptyArray(params.n));
          }
        } else {
          for (var ii = 0; ii < params.length; ii += 1) {
            obj.set(ii, params[ii]);
          }
          obj.set('n', params.length);
        }
      },
      rows: function () {
        return _(_.range(obj.get('n'))).map(function (rowIndex) {
          return obj.get(rowIndex);
        }, obj);
      },
      togglePiece: function (rowIndex, colIndex) {
        obj.get(rowIndex)[colIndex] = +!obj.get(rowIndex)[colIndex];
      },
      hasAnyRooksConflicts: function () {
        return obj.hasAnyRowConflicts() || obj.hasAnyColConflicts();
      },

      hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
        return (
          obj.hasRowConflictAt(rowIndex) ||
          obj.hasColConflictAt(colIndex) ||
          obj.hasMajorDiagonalConflictAt(rowIndex, colIndex) ||
          obj.hasMinorDiagonalConflictAt(rowIndex, colIndex)
        );
      },

      hasAnyQueensConflicts: function () {
        return obj.hasAnyRooksConflicts() || obj.hasAnyMajorDiagonalConflicts() || obj.hasAnyMinorDiagonalConflicts();
      },

      _isInBounds: function (rowIndex, colIndex) {
        return (
          0 <= rowIndex && rowIndex < obj.get('n') &&
          0 <= colIndex && colIndex < obj.get('n')
        );
      },


      /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
      /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

      // ROWS - run from left to right
      // --------------------------------------------------------------
      //
      // test if a specific row on obj board contains a conflict
      hasRowConflictAt: function (row) {
        var counter = 0;

        for (var i = 0; i < row.length; ++i) {
          if (row[i] === 1)++counter;
          if (counter > 1) break;
        }

        return counter > 1;
      },

      // test if any rows on obj board contain conflicts
      hasAnyRowConflicts: function () {
        var rows = obj.rows();

        for (var i = 0; i < rows.length; ++i) {
          if (obj.hasRowConflictAt(rows[i])) {
            return true;
          }
        }

        return false;
      },



      // COLUMNS - run from top to bottom
      // --------------------------------------------------------------
      //
      // test if a specific column on obj board contains a conflict
      hasColConflictAt: function (colIndex, rows) {
        var counter = 0;

        for (var i = 0; i < rows.length; ++i) {
          if (rows[i][colIndex] === 1)++counter;
          if (counter > 1) break;
        }

        return counter > 1;
      },

      // test if any columns on obj board contain conflicts
      hasAnyColConflicts: function () {
        var rows = obj.rows();

        for (var i = 0; i < rows.length; ++i) {
          if (obj.hasColConflictAt(i, rows)) {
            return true;
          }
        }

        return false;
      },



      // Major Diagonals - go from top-left to bottom-right
      // --------------------------------------------------------------
      //
      // test if a specific major diagonal on obj board contains a conflict
      hasMajorDiagonalConflictAt: function (rowIndex, colIndex) {
        var rows = obj.rows();
        var counter = 0;

        var rowIdx = rowIndex;
        var colIdx = colIndex;

        while (obj._isInBounds(rowIdx, colIdx)) {
          if (rows[rowIdx][colIdx] === 1)++counter;
          if (counter > 1) break;

          ++rowIdx;
          ++colIdx;
        }

        return counter > 1;

        rowIdx = rowIndex;
        colIdx = colIndex;
        counter = 0;

        while (obj._isInBounds(rowIdx, colIdx)) {
          if (rows[rowIdx][colIdx] === 1)++counter;
          if (counter > 1) break;

          --rowIdx;
          --colIdx;
        }

        return counter > 1;
      },

      // test if any major diagonals on obj board contain conflicts
      hasAnyMajorDiagonalConflicts: function () {
        var n = obj.get('n');

        for (var i = 0; i < n; ++i) {
          if (obj.hasMajorDiagonalConflictAt(i, 0)) {
            return true;
          }
        }

        for (var i = 0; i < n; ++i) {
          if (obj.hasMajorDiagonalConflictAt(0, i)) {
            return true;
          }
        }

        return false;
      },



      // Minor Diagonals - go from top-right to bottom-left
      // --------------------------------------------------------------
      //
      // test if a specific minor diagonal on obj board contains a conflict
      hasMinorDiagonalConflictAt: function (rowIndex, colIndex) {
        var rows = obj.rows();
        var counter = 0;

        var rowIdx = rowIndex;
        var colIdx = colIndex;

        while (obj._isInBounds(rowIdx, colIdx)) {
          if (rows[rowIdx][colIdx] === 1)++counter;
          if (counter > 1) break;
          ++rowIdx;
          --colIdx;
        }

        if (counter > 1) {
          return true;
        }

        rowIdx = rowIndex;
        colIdx = colIndex;
        counter = 0;

        while (obj._isInBounds(rowIdx, colIdx)) {
          if (rows[rowIdx][colIdx] === 1)++counter;
          if (counter > 1) break;

          --rowIdx;
          ++colIdx;
        }

        if (counter > 1) {
          return true;
        }
      },

      // test if any minor diagonals on obj board contain conflicts
      hasAnyMinorDiagonalConflicts: function () {
        var n = obj.get('n');
        for (var i = 0; i < n; ++i) {
          if (obj.hasMinorDiagonalConflictAt(i, n - 1)) {
            return true;
          }
        }
        for (var ii = 0; ii < n; ii += 1) {
          if (obj.hasMinorDiagonalConflictAt(0, ii)) {
            return true;
          }
        }
        return false;
      }

      /*--------------------  End of Helper Functions  ---------------------*/

    };
    obj.initialize(arraryOrN);
    return obj;
  };
  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return makeEmptyArray(n);
    });
  };
  var makeEmptyArray = function (n) {
    return _(_.range(n)).map(function () {
      return 0;
    });
  };

}());