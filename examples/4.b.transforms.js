require('dotenv').config()
const ReactiveArray = require('../ReactiveArray');
const readline = require('readline');
const fs = require('fs');
const {EOL} = require('os');

function main() {
    return new Promise((resolve) => {
        const fileStream = fs.createReadStream('../inputs/ldf.csv');
        const lineStream = readline.createInterface({
            input: fileStream
        });
        const outputStream = fs.createWriteStream('../outputs/ldf.out.csv');

        /**
         * We can wrap a stream, and then use fluent chaining to treat the stream like an array/
         */
        const transformationStream = ReactiveArray
            .fromStream({stream: lineStream})
            // adding a couple new columns to the csv. Obviously, fixed values aren't useful, but this is a demo.
            .map((line) => `new column,${line},bogus column`)
            // read the EOL, else we end up with a very long string in our output file
            .map((line) => `${line}${EOL}`)
            // convert the array to a stream
            .toStream()
            .pipe(outputStream);

        // this is some node spefic non-sense with line readers
        fileStream.on('end', (e) => {
            lineStream.close();
            lineStream.removeAllListeners();
        });

        outputStream.on('end', () => resolve);

    });
}


main()
    .then(() => process.exit(0))
    .catch((e) => console.error(e) || process.exit(1));
