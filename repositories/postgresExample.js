const getBuilder = require('../clients/Postgres');

module.exports = {
    /**
     * @param user
     * @return {Knex.QueryBuilder<unknown, DeferredKeySelection.ReplaceBase<TResult, unknown>>}
     */
    example1(user) {
        const builder = getBuilder();
        return builder.select(['weight']).from('biometrics');
    }
};
