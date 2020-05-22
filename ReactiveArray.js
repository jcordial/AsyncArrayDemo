const {Readable} = require('stream');

// todo try other data sources
// todo make static transformed repositories.
class Provider {
    constructor(generator) {
        this._generator = generator;
    }

    [Symbol.asyncIterator]() {
        return this;
    }

    next(...args) {
        let next = this._generator().next(...args);
        return next;
    }

    return(value) {
        let return1 = this._generator().return(value);
        return return1;
    }

    throw(e) {
        let throw1 = this._generator().throw(e);
        return throw1;
    }
}

/**
 * @implements {AsyncIterable.<T>}
 * @template T
 */
class ReactiveArray {
    /**
     * @param {GeneratorFunction} provider
     */
    constructor(provider) {
        this._generatorFactory = provider;
    }

    /**
     * @param {{}} options
     * @param {ReadableStream} options.stream
     * @return {ReactiveArray.<T>}
     */
    static fromStream({stream}) {
        async function* streamProvider() {
            try {
                for await (const chunk of stream) {
                    yield chunk;
                }
            } catch (e) {
                console.log(e);
                throw e;

            }
        }

        return new ReactiveArray(() => streamProvider)
    }

    /**
     * @param {{}} options
     * @param {number} options.batchSize
     * @param {number} [options.pageOffset=0]
     * @param {function({batchSize:number, page:number}):Promise.<T[]>} options.getter
     * @return {ReactiveArray.<T>}
     */
    static fromBatcher({batchSize, pageOffset = 0, getter}) {
        let fetched = [];
        let isLastBatch;
        let currentPage = pageOffset;

        /**
         *
         * @return {Promise<void>}
         */
        async function* batchProvider() {
            do {
                if (fetched.length === 0) {
                    if (isLastBatch) {
                        break;
                    }
                    fetched = await getter({batchSize, page: currentPage});
                    if (fetched.length === 0) {
                        break;
                    }
                    if (fetched.length !== batchSize) {
                        isLastBatch = true;
                    }
                    currentPage++;
                }
                yield fetched.shift();
            } while (fetched.length > 0);
        }

        return new ReactiveArray(() => batchProvider);
    }

    /**
     * @template O
     * @param {Iterator.<O>|AsyncIterable.<O>}array
     * @return {ReactiveArray.<O>}
     */
    static from(array) {
        const source = [...array];

        async function* fromProvider() {
            while (source.length > 0) {
                yield source.shift();
            }
        }

        return new ReactiveArray(() => fromProvider);
    }

    /**
     * @template O
     * @param {function():AsyncIterable.<O>} getter
     * @return {ReactiveArray.<O>}
     */
    static fromGetter(getter) {
        async function* fromGetterProvider() {
            const source = await getter();
            while (source.length > 0) {
                yield source.shift();
            }
        }

        return new ReactiveArray(() => fromGetterProvider);
    }

    /**
     *
     * @param {AsyncIterator} first
     * @param {AsyncIterator} rest
     * @return {ReactiveArray}
     */
    static concat(first, ...rest) {
        return first.concat(...rest);
    }

    forEach(work) {
        const iterator = this;

        async function* forEachProvider() {
            for await (const item of iterator) {
                await work(item);
                yield item;
            }
        }

        return new ReactiveArray(forEachProvider);
    }

    concat(...iterators) {
        const previous = this;

        async function* concatProvider() {
            for await (const item of previous) {
                yield item;
            }
            for (const nexIterator of iterators) {
                for await (const item of nexIterator) {
                    yield item;
                }
            }
        }

        return new ReactiveArray(concatProvider);
    }

    /**
     * @param {function(item:T):(bool|Promise<bool>)} filter
     * @return {ReactiveArray.<T>}
     */
    filter(filter) {
        const iterator = this;

        async function* filterProvider() {
            for await (const item of iterator) {
                const keep = filter(item);
                if (keep) {
                    yield item;
                }
            }
        }

        return new ReactiveArray(filterProvider);
    }

    map(transform) {
        const iterator = this;

        async function* mapProvider() {
            for await (const next of iterator) {
                yield transform(next);
            }
        }

        return new ReactiveArray(() => mapProvider);
    }

    collect(size = 1) {
        let queue = [];
        let done = false;
        const previousIterator = this;

        async function* collectProvider() {
            if (done) {
                return;
            }
            for await (const next of previousIterator) {
                queue.push(next);
                if (queue.length === size) {
                    const output = queue;
                    queue = [];
                    yield output;
                }
            }
            done = true;
            if (queue.length > 0) {
                yield queue;
            }
        }

        return new ReactiveArray(() => collectProvider);
    }

    /**
     * @return {Promise<T[]>}
     */
    async toArray() {
        const collection = [];
        for await (const nextItem of this) {
            collection.push(nextItem);
        }
        return collection;
    }

    [Symbol.asyncIterator]() {
        return new Provider(this._generatorFactory());
    }

    /**
     * @return {ReadStream}
     */
    toStream() {
        return Readable.from(new Provider(this._generatorFactory()));
    }
}


module.exports = ReactiveArray;
