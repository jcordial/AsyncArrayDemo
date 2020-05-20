require('dotenv').config()
const getClient = require('../clients/Postgres');
const {example1} = require('../repositories/postgresExample')
const Repositorial = require('../Repositorial');
const wait = require('../utils/wait');
const prettyHeap = require('../utils/prettyHeap');

async function main() {

    const batchRepository = Repositorial.batch({
        async getter({batchSize, page}) {
            await wait(5000);
            return example1().limit(batchSize).offset(batchSize * page);
        },
        batchSize: 3
    });

    console.time('batch');
    for await (const batch of batchRepository) {
        console.timeLog(
            'batch',
            batch,
            prettyHeap()
        );
    }
}


main().then(() => process.exit(0));
