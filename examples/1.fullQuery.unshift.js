require('dotenv').config()
const {example1} = require('../repositories/postgresExample')
const pretendToDoSomething = require('../utils/pretendToDoSomethingHeavy');

async function main() {
    const data = await example1();
    let i = 0;
    while (data.length) {
        if (i++ % 1000 === 0) {
            global.gc();
        }

        await pretendToDoSomething(data.shift(), {fastestCompute: 0, slowestCompute: 0});
    }
}


main().then(() => process.exit(0));
