import type {
    
    AbstractIter,
    Optional,
    Modes,
    Collection,

} from '../interface';

import {

    intoAsyncIterator,
    intoIterator,
    isAsyncIterable,
    isSyncIterable,

} from '../../helpers';

import {

    mapSync,
    mapAsync,
    filterSync,
    filterAsync,
    flattenSync,
    flattenAsync,
    flatMapSync,
    flatMapAsync,
    take,

} from '../modifiers';


import {

    toArray,
    collect,

} from '../collectors';


import {

    sum,
    avg,
    max,
    min,

} from '../aggregators';

export default class Iter<T> {

    protected mode: Modes;

    protected asyncIter: Optional<AsyncIterableIterator<T>>;

    protected iter: Optional<IterableIterator<T>>;

    constructor(iterable: Iterable<T> | AsyncIterable<T>, mode?: Modes) {
        if (isAsyncIterable(iterable)) {
            this.mode = mode ?? 'async';
            this.asyncIter = intoAsyncIterator(iterable);
        }

        if (isSyncIterable(iterable)) {
            this.mode = mode ?? 'sync';
            this.iter = intoIterator(iterable);
        }
    }

    public map<R>(
        cb: (el: T, index?: number, iter?: typeof this.iter | typeof this.asyncIter) => R,
        mode?: Modes
    ): Iter<R> {
        if (mode === 'sync') {
            return mapSync(this.iter, cb);
        }

        if (mode === 'async') {
            return mapAsync(this.asyncIter, cb);
        }

        return this.mode === 'async'
            ? mapAsync(this.asyncIter, cb)
            : mapSync(this.iter, cb);
    }

    public filter(
        cb: (el: T, index?: number, iter?: typeof this.iter | typeof this.asyncIter) => boolean,
        mode?: Modes
    ): Iter<T> {
        if (mode === 'sync') {
            return filterSync(this.iter, cb);
        }

        if (mode === 'async') {
            return filterAsync(this.asyncIter, cb);
        }

        return this.mode === 'async'
            ? filterAsync(this.asyncIter, cb)
            : filterSync(this.iter, cb);
    }

    public flatMap<R>(
        cb: (el: T, index?: number, iter?: typeof this.iter | typeof this.asyncIter) => R,
        mode?: Modes
    ): Iter<R> {
        if (mode === 'sync') {
            return flatMapSync(this.iter, cb);
        }

        if (mode === 'async') {
            return flatMapAsync(this.asyncIter, cb);
        }

        return this.mode === 'async'
            ? flatMapAsync(this.asyncIter, cb)
            : flatMapSync(this.iter, cb);
    }

    public flatten<T>(depth: number): Iter<T> {
        return this.mode === 'async'
            ? flattenAsync(this.asyncIter, depth)
            : flattenSync(this.iter, depth);
    }

    public take(count: number): Iter<T> {
        return this.mode === 'sync'
            ? take(this.iter, count)
            : take(this.asyncIter, count);
    }


    public toArray(): Promise<Array<T>> {
        return this.mode === 'sync'
            ? toArray(this.iter)
            : toArray(this.asyncIter);
    }

    public collect(collection: Collection<T> | Array<T>): Promise<Array<T> | Collection<T>> {
        return this.mode === 'sync'
            ? collect(this.iter, collection)
            : collect(this.asyncIter, collection);
    }



    public sum(fn?: (el: T) => number): Promise<number> {
        return this.mode === 'sync'
            ? sum(this.iter, fn)
            : sum(this.asyncIter, fn);
    }

    public avg(fn?: (el: T) => number): Promise<number> {
        return this.mode === 'sync'
            ? avg(this.iter, fn)
            : avg(this.asyncIter, fn);
    }

    public max(fn?: (el: T) => number): Promise<number> {
        return this.mode === 'sync'
            ? max(this.iter, fn)
            : max(this.asyncIter, fn);

    }

    public min(fn?: (el: T) => number): Promise<number> {
        return this.mode === 'sync'
            ? min(this.iter, fn)
            : min(this.asyncIter, fn);
    }


    [Symbol.iterator](): IterableIterator<T> {
        return this.values();
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
        return this.asyncValues();
    }

    values() {
        if (this.iter == null)
            throw  new Error('Sync iterator is not defined.');

        return intoIterator(this.iter);
    }

    asyncValues(): AsyncIterableIterator<T> {
        if (this.asyncIter == null)
            throw  new Error('Async iterator is not defined.');

        return intoAsyncIterator(this.asyncIter);
    }

}