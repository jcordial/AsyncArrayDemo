const prettyBytes = require('pretty-bytes');
module.exports = function () {
    return Object.entries(process.memoryUsage())
        .reduce((output, [key, bytes]) => ({
            ...output,
            [key]: prettyBytes(bytes)
        }), {});
}
