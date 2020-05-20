/**
 * @param {number} [until]
 */
module.exports = function wait(until) {
    return new Promise((resolve) => {
        setTimeout(resolve, until)
    });
}
