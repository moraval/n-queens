var _ = require('underscore');
var expect = require('chai').expect;

var Board = require('../src/worker/classes/Board');
// var countNQueensSolutions = require('../src/worker/countNQueens');
var countNQueensSolutions = require('../src/worker/countNQueensDistributed');
var nQueensJobQueueHandler = require('../src/worker/classes/nQueensJobQueueHandler');
var nQueensJobProcessor = require('../src/worker/classes/nQueensJobProcessor');

describe("Board", function () {

  var capitalize = function (word) {
    return word[0].toUpperCase() + word.slice(1);
  };

  var verifyConflictTypes = function (expectedConflicts, matrix) {
    // The Board() constructor will accept a matrix and build that into a (Backbone) Board object (as defined in Board.js)
    var board = new Board(matrix);
    _.map('row col rooks majorDiagonal minorDiagonal queens'.split(' '), function (conflictType) {
      var conflictDetected = board['hasAny' + capitalize(conflictType) + 'Conflicts']();
      var conflictExpected = _(expectedConflicts).contains(conflictType);
      var message = conflictExpected ? 'should' : 'should not';

      it(message + " find a " + conflictType + " conflict", function () {
        expect(conflictDetected).to.be.equal(conflictExpected);
      });
    });
  };

  describe("Empty board", function () {
    verifyConflictTypes([''], [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  describe("Board with row conflicts", function () {
    verifyConflictTypes(['row', 'rooks', 'queens'], [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  describe("Board with col conflicts", function () {
    verifyConflictTypes(['col', 'rooks', 'queens'], [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  describe("Board with major diagonal conflicts", function () {
    verifyConflictTypes(['majorDiagonal', 'queens'], [
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  describe("Board with minor diagonal conflicts", function () {
    verifyConflictTypes(['minorDiagonal', 'queens'], [
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });
});
// var expectedSolutionCount = [1, 1, 0, 0, 2, 10, 4, 40, 92][n];

describe('countNQueensSolutions()', function () {
  it('finds the number of valid solutions for n = 0', function () {
    var response = countNQueensSolutions(0);
    expect(response.solutionCount).to.be.equal(1);
  });

  it('finds the number of valid solutions for n = 1', function () {
    var response = countNQueensSolutions(1);
    expect(response.solutionCount).to.be.equal(1);
  });

  it('finds the number of valid solutions for n = 2', function () {
    var response = countNQueensSolutions(2);
    expect(response.solutionCount).to.be.equal(0);
  });

  it('finds the number of valid solutions for n = 3', function () {
    var response = countNQueensSolutions(3);
    expect(response.solutionCount).to.be.equal(0);
  });

  it('finds the number of valid solutions for n = 4', function () {
    var response = countNQueensSolutions(4);
    expect(response.solutionCount).to.be.equal(2);
  });

  it('finds the number of valid solutions for n = 5', function () {
    var response = countNQueensSolutions(5);
    expect(response.solutionCount).to.be.equal(10);
  });

  it('finds the number of valid solutions for n = 6', function () {
    var response = countNQueensSolutions(6);
    expect(response.solutionCount).to.be.equal(4);
  });

  it('finds the number of valid solutions for n = 40', function () {
    var response = countNQueensSolutions(7);
    expect(response.solutionCount).to.be.equal(40);
  });

  it('finds the number of valid solutions for n = 40', function () {
    var response = countNQueensSolutions(8);
    expect(response.solutionCount).to.be.equal(92);
  });
});