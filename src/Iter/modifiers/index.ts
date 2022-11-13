import Iter from '../Iter/Iter';

import {

    isSyncIterable,
    isAsyncIterable

} from '../../helpers';



export function mapSync<R, V>(
    iter: IterableIterator<V>,
    cb: (el: V, index?: number, iter?: typeof this.iter) => R
): Iter<R> {
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

export function mapAsync<R, V>(
    iter: AsyncIterableIterator<V>,
    cb: (el: V, index?: number, iter?: typeof this.asyncIter) => R
): Iter<R> {
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



export function filterSync<V>(
    iter: IterableIterator<V>,
    cb: (el: V, index?: number, iter?: typeof this.iter) => boolean
): Iter<V> {
    let i = 0;

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

export function filterAsync<V>(
    iter: AsyncIterableIterator<V>,
    cb: (el: V, index?: number, iter?: typeof this.asyncIter) => boolean
): Iter<V> {
    let i = 0;

    const filterIter = <AsyncIterable<V>>(async function *(self) {
        for await (const el of iter) {
            if(cb(<V>el, i++, self.asyncIter)) yield el
        }
    })(this)

    return new Iter(filterIter, 'async');
}



export function flattenSync<R>(
    iter: IterableIterator<unknown>,
    depth: number = 1
): Iter<R> {

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

export function flattenAsync<R>(
    iter: AsyncIterableIterator<unknown>,
    depth: number = 1
): Iter<R> {
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



export function flatMapSync<T, R>(
    iter: IterableIterator<T>,
    cb: (el: unknown, index?: number, iter?: typeof this.iter) => R
) : Iter<R> {

    function *flatMapIter(arr: Iterable<unknown | Iterable<unknown>>) {
        for (const el of arr) {
            if (isSyncIterable(el) && typeof el !== 'string')
                yield* flatMapIter(el)
            else
                yield cb(el)
        }
    }

    return new Iter(flatMapIter(iter));
}

export function flatMapAsync<T, R>(
    iter: AsyncIterableIterator<T>,
    cb: (el: unknown, index?: number, iter?: typeof this.asyncIter) => R
) : Iter<R> {

    function *syncFlatMapIter(arr: Iterable<unknown | Iterable<unknown> | AsyncIterable<unknown>>) {
        for (const el of arr) {
            if (isAsyncIterable(el) && typeof el !== 'string') {
                yield* asyncFlatMapIter(el)

            } if (isSyncIterable(el) && typeof el !== 'string') {
                yield* syncFlatMapIter(el)
            } else {
                yield cb(<T>el)
            }
        }
    }

    async function *asyncFlatMapIter(arr: AsyncIterable<unknown | Iterable<unknown> | AsyncIterable<unknown>>) {
        for await (const el of arr) {
            if (isAsyncIterable(el) && typeof el !== 'string') {
                yield* asyncFlatMapIter(el)

            } if (isSyncIterable(el) && typeof el !== 'string') {
                yield* syncFlatMapIter(el)
            } else {
                yield cb(<T>el)
            }
        }
    }

    return asyncFlatMapIter(iter)
}


export function take<T>(
    iter: IterableIterator<T> | AsyncIterableIterator<T>,
    count: number
): IterableIterator<T> | AsyncIterableIterator<T> {
    let i = 0;

    if (isSyncIterable(iter)) {
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