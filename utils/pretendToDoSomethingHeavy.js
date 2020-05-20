const wait = require('./wait');
const prettyHeap = require('./prettyHeap');
const readline = require('readline');

console.time('batch');

let buffer = '';


module.exports = async function (data, {fastestCompute = 1000, slowestCompute = 3000} = {}) {
    await wait(Math.random() * (slowestCompute - fastestCompute) + slowestCompute);
    buffer = 'Heap size: ' + prettyHeap().heapUsed + '\r';
    readline.clearLine(process.stdout);
    process.stdout.write(buffer);
    readline.moveCursor(process.stdout, 99, 0)
}
