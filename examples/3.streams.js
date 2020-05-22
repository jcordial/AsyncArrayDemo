require('dotenv').config()
const {example1} = require('../repositories/postgresExample')
const ReactiveArray = require('../ReactiveArray');
const wait = require('../utils/wait');
const prettyHeap = require('../utils/prettyHeap');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

async function main() {
    const lineStream = readline.createInterface({
        input: fs.createReadStream('/Users/jasoncordial/PhpstormProjects/repositorials/ldf.csv')
    });


    const streamRepository = ReactiveArray.fromStream({stream: lineStream});
    // while you can already do this with streams, it opens up some interesting possibilities in the next couple
    // examples
    for await (const line of streamRepository) {
        console.log(line);
        await wait(500);
    }
}


main().then(() => process.exit(0));
