require('dotenv').config()
const {example1} = require('../repositories/postgresExample')
const pretendToDoSomething = require('../utils/pretendToDoSomethingHeavy');

// pulls all data into memory, bad.
// this is what we don't want to have happen
async function main() {
    const data = await example1();
    for (const batch of data) {
        await pretendToDoSomething(data);
    }
}


main().then(() => process.exit(0));
