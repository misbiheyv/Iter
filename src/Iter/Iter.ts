import type {

    Optional,
    Modes,

} from './interface';

import {

    intoAsyncIterator,
    intoIterator,
    isAsyncIterable,
    isSyncIterable,

} from '../helpers';

import {

    mapSync,
    mapAsync,
    filterSync,
    filterAsync,
    flattenSync,
    flattenAsync,
    flatMapSync,
    flatMapAsync,
    take

} from './modifiers';

import {

    sum,
    avg

} from './aggregators';

export default class Iter<T> {

    get iter() {
        return this.#iter;
    }
    get asyncIter() {
        return this.#asyncIter;
    }

    #mode: Modes;

    #asyncIter: Optional<AsyncIterableIterator<T>>;

    #iter: Optional<IterableIterator<T>>;

    constructor(iterable: Iterable<T> | AsyncIterable<T>, mode: Modes = 'sync') {
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
        mode?: Modes
    ): Iter<R> {
        if (mode === 'sync') {
            return mapSync(this.#iter, cb);
        }

        if (mode === 'async') {
            return mapAsync(this.#asyncIter, cb);
        }

        return this.#mode === 'async'
            ? mapAsync(this.#asyncIter, cb)
            : mapSync(this.#iter, cb);
    }

    public filter(
        cb: (el: T, index?: number, iter?: typeof this.iter | typeof this.asyncIter) => boolean,
        mode?: Modes
    ): Iter<T> {
        if (mode === 'sync') {
            return filterSync(this.#iter, cb);
        }

        if (mode === 'async') {
            return filterAsync(this.#asyncIter, cb);
        }

        return this.#mode === 'async'
            ? filterAsync(this.#asyncIter, cb)
            : filterSync(this.#iter, cb);
    }

    public flatMap<R>(
        cb: (el: T, index?: number, iter?: typeof this.iter | typeof this.asyncIter) => R,
        mode?: Modes
    ): Iter<R> {
        if (mode === 'sync') {
            return flatMapSync(this.#iter, cb);
        }

        if (mode === 'async') {
            return flatMapAsync(this.#asyncIter, cb);
        }

        return this.#mode === 'async'
            ? flatMapAsync(this.#asyncIter, cb)
            : flatMapSync(this.#iter, cb);
    }

    public flatten<T>(depth: number): Iter<T> {
        return this.#mode === 'async'
            ? flattenAsync(this.#asyncIter, depth)
            : flattenSync(this.#iter, depth);
    }


    public sum(): Promise<number> {
        return this.#mode === 'sync' 
            ? sum(<IterableIterator<number>>this.#iter)
            : sum(<AsyncIterableIterator<number>>this.#asyncIter);
    }

    public avg(): Promise<number> {
        return this.#mode === 'sync' 
            ? avg(<IterableIterator<number>>this.#iter) 
            : avg(<AsyncIterableIterator<number>>this.#asyncIter);
    }


    public take(count: number): IterableIterator<T> | AsyncIterableIterator<T> {
        return this.#mode === 'sync' 
            ? take(this.#iter, count) 
            : take(this.#asyncIter, count);
    }

    [Symbol.iterator](): IterableIterator<T> {
        return this.values();
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
        return this.asyncValues();
    }

    values() {
        if (this.#iter == null)
            throw  new Error('Sync iterator is not defined.');

        return intoIterator(this.#iter);
    }

    asyncValues(): AsyncIterableIterator<T> {
        if (this.#asyncIter == null)
            throw  new Error('Async iterator is not defined.');

        return intoAsyncIterator(this.#asyncIter);
    }

}