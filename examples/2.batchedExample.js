require('dotenv').config()
const getClient = require('../clients/Postgres');
const {example1} = require('../repositories/postgresExample')
const ReactiveArray = require('../ReactiveArray');
const wait = require('../utils/wait');
const prettyHeap = require('../utils/prettyHeap');

/**
 * Pulls resources in in batches. We shrink the overall memory footprint at any given point to a (potentially)
 * known maximum. This should be much better for a shared resource environment.
 */
async function main() {
    // this is function to fetch batches from the database
    const batchFetcher = async ({batchSize, page}) => {
        await wait(5000);
        return example1().limit(batchSize).offset(batchSize * page);
    };


    // configure the batch size
    const batchRepository = ReactiveArray.fromBatcher({
        getter: batchFetcher,
        batchSize: 3
    });


    console.time('batch');
    for await (const batch of batchRepository) {
        console.timeLog('batch', batch);
    }
}


main().then(() => process.exit(0));
