require('dotenv').config()
const {example1} = require('../repositories/postgresExample')
const ReactiveArray = require('../ReactiveArray');
const wait = require('../utils/wait');
const prettyHeap = require('../utils/prettyHeap');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const {EOL} = require('os');

async function main() {
    const lineStream = readline.createInterface({
        input: fs.createReadStream('../inputs/ldf.csv')
    });

    const streamRepository = ReactiveArray
        .fromStream({stream: lineStream})
        // this will collect at most ten items (less if the stream ends) and emit an array with those ten items
        // instead of each individual item.
        .collect(10)
        // this turns 10 lines of the csv into a single line
        .map((chunk) => chunk.join())
        // this changes the column delimeter to a smiley face. Line it now a string instead of an array of ten strings.
        .map((line) => line.replace(/,/g, '\uD83D\uDE00'));

    for await (const line of streamRepository) {
        console.log('=========NEWITEM========')
        console.log(line, EOL, typeof line);
        await wait(5500);
    }
}


main().then(() => process.exit(0));
