function intoAsyncIterator<T>(iterable: AsyncIterable<T>): AsyncIterableIterator<T> {
    const iter = iterable[Symbol.asyncIterator]();

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next() {
            return iter.next()
        }
    }
}

function intoIterator<T>(iterable: Iterable<T>): IterableIterator<T> {
    const iter = iterable[Symbol.iterator]();

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return iter.next()
        }
    }
}

function isAsyncIterable(obj: unknown): obj is AsyncIterable<unknown> {
    return typeof obj[Symbol.asyncIterator] === "function";
}

function isSyncIterable(obj: unknown): obj is Iterable<unknown> {
    return typeof obj[Symbol.iterator] === "function";
}

type Optional<T> = T | null;

export default class Iter<T> {

    get iter() {
        return this.#iter;
    }
    get asyncIter() {
        return this.#asyncIter;
    }

    #mode: 'sync' | 'async';

    #asyncIter: Optional<AsyncIterableIterator<T>>;

    #iter: Optional<IterableIterator<T>>;

    constructor(iterable: Iterable<T> | AsyncIterable<T>, mode: 'sync' | 'async' = 'sync') {
        this.#mode = mode

        if (isAsyncIterable(iterable)) {
            this.#asyncIter = intoAsyncIterator(iterable);
        }
        if (isSyncIterable(iterable)) {
            this.#iter = intoIterator(iterable);
        }
    }

    public map<R>(
        cb: (el: T, index?: number, iter?: typeof this.iter | typeof this.asyncIter) => R,
        mode?: 'sync' | 'async'
    ): Iter<R> {
        if (mode === 'sync') {
            return this.#mapSync(cb);
        }

        if (mode === 'async') {
            return this.#mapAsync(cb);
        }

        return this.#mode === 'async'
            ? this.#mapAsync(cb)
            : this.#mapSync(cb);
    }

    public filter(
        cb: (el: T, index?: number, iter?: typeof this.iter | typeof this.asyncIter) => boolean,
        mode?: 'sync' | 'async'
    ): Iter<T> {
        if (mode === 'sync') {
            return this.#filterSync(cb);
        }

        if (mode === 'async') {
            return this.#filterAsync(cb);
        }

        return this.#mode === 'async'
            ? this.#filterAsync(cb)
            : this.#filterSync(cb);
    }

    public flatMap<R>(
        cb: (el: T, index?: number, iter?: typeof this.iter | typeof this.asyncIter) => R,
        mode?: 'sync' | 'async'
    ): Iter<R> {
        if (mode === 'sync') {
            return this.#flatMapSync(cb);
        }

        if (mode === 'async') {
            return this.#flatMapAsync(cb);
        }

        return this.#mode === 'async'
            ? this.#flatMapAsync(cb)
            : this.#flatMapSync(cb);
    }

    public flatten<T>(depth: number): Iter<T> {
        return this.#mode === 'async'
            ? this.#flattenAsync(depth)
            : this.#flattenSync(depth);
    }

    public take(count): IterableIterator<T> | AsyncIterableIterator<T> {
        let i = 0;

        if (this.#mode === 'sync') {
            return {
                [Symbol.iterator](): IterableIterator<T> {
                    return this;
                },
                next: (): IteratorResult<T> => {
                    if (i++ < count) {
                        return this.iter.next()
                    }
                    return {done: true, value: undefined};
                }
            }
        }

        return {
            [Symbol.asyncIterator]() {
                return this;
            },
            next: () => {
                if (i++ < count) {
                    return this.asyncIter.next()
                }
                return Promise.resolve({done: true, value: undefined});
            }
        }
    }


    #mapSync<R>(cb: (el: T, index?: number, iter?: typeof this.iter) => R): Iter<R> {
        const
            iter = this.#iter;
        let
            i = 0;

        const mapIter = {
            [Symbol.iterator]() {
                return this;
            },
            next: () => {
                let cur = iter.next();

                return {
                    value: !cur.done ? cb(cur.value, i++, this.iter) : undefined,
                    done: cur.done
                };
            }
        }

        return new Iter<R>(mapIter);
    }

    #mapAsync<R>(cb: (el: T, index?: number, iter?: typeof this.asyncIter) => R): Iter<R> {
        const
            iter = this.#asyncIter;
        let
            i = 0;

        const mapIter = {
            [Symbol.asyncIterator]() {
                return this;
            },
            next: () => {
                return iter.next().then(res => {
                    if (res.done) {
                        return { done: true }
                    }
                    return {
                        done: false,
                        value: cb(res.value, i++, this.asyncIter)
                    }
                })
            }
        }

        return new Iter(mapIter, 'async');
    }

    #filterSync<T>(cb: (el: T, index?: number, iter?: typeof this.iter) => boolean): Iter<T> {
        const
            iter = this.#iter;
        let
            i = 0;

        const filterIter = {
            [Symbol.iterator]() {
                return this;
            },
            next: () => {
                let cur = iter.next();

                while (!cur.done && !cb(cur.value, i++, this.iter)) {
                    cur = iter.next();
                }

                return cur;
            }
        }

        return new Iter(filterIter);
    }

    #filterAsync<T>(cb: (el: T, index?: number, iter?: typeof this.asyncIter) => boolean): Iter<T> {
        const
            iter = this.asyncIter;
        let
            i = 0;

        const filterIter = <AsyncIterable<T>>(async function *(self) {
            for await (const el of iter) {
                if(cb(<T>el, i++, self.asyncIter)) yield el
            }
        })(this)

        return new Iter(filterIter, 'async');
    }

    #flatMapSync<R>(cb: (el: T, index?: number, iter?: typeof this.iter) => R) : Iter<R> {
        const
            iter = this.iter

        function *flatMapIter(arr: Iterable<any>) {
            for (const el of arr) {
                if (isSyncIterable(el) && typeof el !== 'string')
                    yield* flatMapIter(el)
                else
                    yield cb(el)
            }
        }

        return new Iter(flatMapIter(iter));
    }

    #flatMapAsync<R>(cb: (el: T, index?: number, iter?: typeof this.asyncIter) => R) : Iter<R> {
        const
            iter = this.asyncIter;

        function *SyncFlatMapIter(arr: Iterable<T | Iterable<T> | AsyncIterable<T>>) {
            for (const el of arr) {
                if (isAsyncIterable(el) && typeof el !== 'string') {
                    yield* AsyncFlatMapIter(el)

                } if (isSyncIterable(el) && typeof el !== 'string') {
                    yield* SyncFlatMapIter(el)
                } else {
                    yield cb(<T>el)
                }
            }
        }

        async function *AsyncFlatMapIter(arr: AsyncIterable<T | Iterable<T> | AsyncIterable<T>>) {
            for await (const el of arr) {
                if (isAsyncIterable(el) && typeof el !== 'string') {
                    yield* AsyncFlatMapIter(el)

                } if (isSyncIterable(el) && typeof el !== 'string') {
                    yield* SyncFlatMapIter(el)
                } else {
                    yield cb(<T>el)
                }
            }
        }

        return AsyncFlatMapIter(iter)

        // return new Iter(AsyncFlatMapIter(iter), 'async');
    }

    #flattenAsync<T>(depth: number = 1): Iter<T> {
        const
            iter = this.asyncIter;

        async function *flatten(arr: AsyncIterable<any> | Iterable<any>, depth) {
            if (isAsyncIterable(arr)) {
                for await (const el of arr) {
                    if ((isSyncIterable(el) || isAsyncIterable(el)) && typeof el !== 'string' && depth > 0) {
                        yield* flatten(el, depth - 1)
                    }
                    else
                        yield el
                }
            } else if (isSyncIterable(arr)) {
                for (const el of arr) {
                    if ((isSyncIterable(el) || isAsyncIterable(el)) && typeof el !== 'string' && depth > 0)
                        yield* flatten(el, depth - 1)
                    else
                        yield el
                }
            }
        }

        return new Iter(flatten(iter, depth));
    }

    #flattenSync<T>(depth: number = 1): Iter<T> {
        const
            iter = this.iter;

        function *flat(arr: Iterable<any>, depth) {
            for (const el of arr) {
                if (isSyncIterable(el) && typeof el !== 'string' && depth > 0)
                    yield* flat(el, depth - 1)
                else
                    yield el
            }
        }

        return new Iter(flat(iter, depth));
    }

    [Symbol.iterator](): IterableIterator<T> {
        if (this.#iter == null)
                throw  new Error('Sync iterator is undefined');

        return intoIterator(this.#iter);
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
        if (this.#asyncIter == null)
            throw  new Error('Async iterator is undefined');

        return intoAsyncIterator(this.#asyncIter);
    }

}






(async function() {
    Array.prototype[Symbol.asyncIterator] = () => {
        let i = 0;

        return {
            [Symbol.asyncIterator]() {
                return this;
            },
            next: () => {
                return new Promise(res => setTimeout(() => res(++i), 200))
                    .then(res => ({
                        done: i > 2,
                        value: new Set([new Set([i])])
                    }))
            }
        }
    }

    const iter = new Iter([1], 'async')

    for await (const el of iter.flatMap(el => el)) {
        console.log(el)
    }
})()
