$(document).ready(function () {

    var NQueensDistributionHandler = function (n) {

        var self = {},
            __self = {};

        __self.n = n;

        __self.init = function () {
            __self.worker = new Worker('dist/worker/worker.js');
            __self.$messages = $('.messages');
        };

        __self.startQueue = function (n) {
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
            __self.worker.addEventListener('message', function (e) {
                console.log(e.data);
                __self.pushMessage(e.data.n, e.data.solution);
                worker.postMessage(e.data.n + 1);
            }, false);
            __self.worker.postMessage({
                n: n
            }); // Send data to our worker.
        };
        __self.pushMessage = function (n, solution) {
            var str = '<div class="message">';
            str += 'Solutions for n == ' + e.data.n + ': ' + e.data.solution;
            str += '</div>';
            __self.$messages.append(str);
        };
        __self.init();
        return self;
    };
    var distributionHandler = new NQueensDistributionHandler();
});