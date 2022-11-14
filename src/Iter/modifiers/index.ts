import Iter from '../Iter/iter';

import {

    isSyncIterable,
    isAsyncIterable

} from '../../helpers';
import {Modes} from "../interface";



export function mapSync<R, V>(
    iter: IterableIterator<V>,
    cb: (el: V, index?: number, iter?: unknown) => R
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
                value: !cur.done ? cb(cur.value, i++, iter) : undefined,
                done: cur.done
            };
        }
    }

    return new Iter<R>(mapIter);
}

export function mapAsync<R, V>(
    iter: AsyncIterableIterator<V>,
    cb: (el: V, index?: number, iter?: unknown) => R
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
                    value: cb(res.value, i++, iter)
                }
            })
        }
    }

    return new Iter(mapIter, 'async');
}



export function filterSync<V>(
    iter: IterableIterator<V>,
    cb: (el: V, index?: number, iter?: unknown) => boolean
): Iter<V> {
    let i = 0;

    const filterIter = {
        [Symbol.iterator]() {
            return this;
        },
        next: () => {
            let cur = iter.next();

            while (!cur.done && !cb(cur.value, i++, iter)) {
                cur = iter.next();
            }

            return cur;
        }
    }

    return new Iter(filterIter);
}

export function filterAsync<V>(
    iter: AsyncIterableIterator<V>,
    cb: (el: V, index?: number, iter?: unknown) => boolean
): Iter<V> {
    let i = 0;

    const filterIter = <AsyncIterable<V>>(async function *() {
        for await (const el of iter) {
            if(cb(<V>el, i++, iter)) yield el
        }
    })()

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
                if ((isSyncIterable(el) || isAsyncIterable(el)) && typeof el !== 'string' && depth > 0) 
                    yield* flatten(el, depth - 1)
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
    cb: (el: unknown, index?: number, iter?: unknown) => R
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
    cb: (el: unknown, index?: number, iter?: unknown) => R
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

    return new Iter(asyncFlatMapIter(iter), 'async')
}


export function take<T>(
    iter: IterableIterator<T> | AsyncIterableIterator<T>,
    count: number,
    mode?: Modes
): Iter<T> {

    let i = 0;

    if (isSyncIterable(iter) || mode === 'sync') {
        return new Iter(<Iterable<T>>{
            [Symbol.iterator](): IterableIterator<T> {
                return this;
            },
            next: () => {
                if (i++ < count) {
                    return iter.next()
                }
                return {done: true, value: undefined};
            }
        })
    }

    if (mode === 'async' || isAsyncIterable(iter)) {
        return new Iter(<AsyncIterable<T>>{
            [Symbol.asyncIterator]() {
                return this;
            },
            next: () => {
                if (i++ < count) {
                    return iter.next()
                }
                return Promise.resolve({done: true, value: undefined});
            }
        })
    }
}


export function enumerate<T>(iter: IterableIterator<T> | AsyncIterableIterator<T>): Iter<[number, T]> {
    let i = 0;

    if (isSyncIterable(iter)) {
        const gen = function* () {
            for (const el of iter) {
                yield <[number, T]>[i++, el];
            }
        }
        return new Iter(gen());
    }

    if (isAsyncIterable(iter)) {
        const gen = async function* () {
            for await (const el of iter) {
                yield <[number, T]>[i++, el];
            }
        }

        return new Iter(gen());
    }

    throw new Error('Passed argument is not iterable.')
}


export function fromRange<T>(
    iter: IterableIterator<T> | AsyncIterableIterator<T>,
    start: number,
    end: number
): Iter<T> {
    if (isSyncIterable(iter)) {
        let i = 0;
        const gen = function* () {
            for (const el of iter) {
                if (i++ < start) continue;
                if (i > end + 1) return;
                yield el;
            }
        }
        return new Iter(gen())
    }

    if (isAsyncIterable(iter)) {
        let i = 0;
        const gen = async function* () {
            for await (const el of iter) {
                if (i++ < start) continue;
                if (i > end + 1) return;
                yield el;
            }
        }

        return new Iter(gen());
    }

    throw new Error('Passed argument is not iterable.');
}


export function forEach<T>(
    iter: IterableIterator<T>,
    cb: (el: T, index?: number, iter?: unknown) => void
): void {
    let i = 0;

    const gen = function* () {
        for (const el of iter) {
            yield el;
        }
    }
    for (const el of gen()) {
        cb(el, i++, iter)
    }
}

export async function asyncForEach<T>(
    iter: AsyncIterableIterator<T>,
    cb: (el: T, index?: number, iter?: unknown) => void
): Promise<void> {
    let i = 0;

    const gen = async function* () {
        for await (const el of iter) {
            yield el;
        }
    };

    for await (const el of gen()) {
        cb(el, i++, iter);
    }

    return Promise.resolve();
}


//! ================= BE CAREFUL! DANGEROUS ZONE! FUNCTIONS BELOW AREN'T TESTED YET ================= !//


