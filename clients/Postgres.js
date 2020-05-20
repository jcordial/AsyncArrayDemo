const knex = require('knex');

let connection;
/**
 * @return {Transaction}
 */
module.exports = function () {
    if (connection) return connection;
    connection = knex({
        client: 'pg',
        connection: "postgresql://localhost:5432/postgres",
    });
    return connection;
}
