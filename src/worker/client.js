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