;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(document).ready(function () {
    var worker = new Worker('dist/worker/worker.js');

    worker.addEventListener('message', function (e) {
        console.log(e.data);
        var str = '<div class="message">';
        str += 'Solutions for n == ' + e.data.n + ': ' + e.data.solution;
        str += '</div>';
        $('.messages').append(str);
        worker.postMessage(e.data.n + 1);
    }, false);
    worker.postMessage(4); // Send data to our worker.

});
},{}]},{},[1])
;