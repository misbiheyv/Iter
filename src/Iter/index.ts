import type { Collection } from './interface';

import * as modifiers from './modifiers';

import * as collectors from './collectors';

import * as aggregators from './aggregators';

import * as combinators from './combinators';

import {

    intoIterator,
    createReverseIterator,
    isIterable,
    isAsyncIterable,
    isSyncIterable,
    isReversible,

} from '../helpers';


export default class Iter<T> {

    protected collection: Iterable<T> | AsyncIterable<T>;

    protected iter: IterableIterator<T> | AsyncIterableIterator<T>;

    constructor(iterable:  Iterable<T> | AsyncIterable<T>) {
        this.collection = iterable;

        if (isAsyncIterable(this.collection)) {
            this.iter = intoIterator(this.collection);
            return;
        }

        if (isSyncIterable(this.collection)) {
            this.iter = intoIterator(this.collection);
            return;
        }

        throw new Error('Passed argument is not iterable.')
    }

    public map<R>(
        cb: (el: T, index?: number, collection?: typeof this.collection) => R
    ): Iter<R> {
        return new Iter(modifiers.map(this.collection, cb));
    }

    public filter(
        cb: (el: T, index?: number, collection?: typeof this.collection) => boolean,
    ): Iter<T> {
        return new Iter(modifiers.filter(this.collection, cb));
    }

    public flatMap<R>(
        cb: (el: T, index?: number, collection?: typeof this.collection) => R,
    ): Iter<R> {
        return new Iter(modifiers.flatMap(this.collection, cb));
    }

    public forEach(
        cb: (el: T, index?: number, collection?: typeof this.collection) => void
    ): Promise<void> {
        return modifiers.forEach(this.collection, cb);
    }

    public forEachChunked(
        cb: (el: T, index?: number, collection?: typeof this.collection) => void
    ): Promise<void> {
        return modifiers.chunkedForEach(this.collection, cb);
    }

    public flatten(depth: number): Iter<T> {
        return new Iter(modifiers.flatten(this.collection, depth));
    }

    public take(count: number): Iter<T> {
        return new Iter(modifiers.take(this.collection, count))
    }

    public inRange(start: number, end?: number): Iter<T> {
        return new Iter(modifiers.inRange(this.collection, start, end));
    }

    public cycle(): Iter<T> {
        return new Iter(modifiers.cycle(this.collection));
    }

    public enumerate(): Iter<[number, T]> {
        return new Iter(modifiers.enumerate(this.collection));
    }



    public toArray(): Promise<Array<T>> {
        return collectors.toArray(this.collection);
    }

    public collect(collection: Array<T>): Promise<Array<T>>;
    public collect(collection: Collection<T>): Promise<Collection<T>>;

    public collect(collection: Collection<T> | Array<T>): Promise<Array<T> | Collection<T>> {
        return collectors.collect(this.collection, collection);
    }

    public sum(fn?: (el: T) => number): Promise<number> {
        return aggregators.sum(this.collection, fn);
    }

    public avg(fn?: (el: T) => number): Promise<number> {
        return aggregators.avg(this.collection, fn);
    }

    public max(fn?: (el: T) => number): Promise<number> {
        return aggregators.max(this.collection, fn);

    }

    public min(fn?: (el: T) => number): Promise<number> {
        return aggregators.min(this.collection, fn);
    }


    [Symbol.iterator](): IterableIterator<T> {
        if (isSyncIterable(this.iter)) {
            return this.iter;
        }
        throw new Error('Iter does not have [Symbol.iterator].')
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
        if (isAsyncIterable(this.iter)) {
            return this.iter;
        }

        throw new Error('Iter does not have [Symbol.asyncIterator].')
    }

    values(): IterableIterator<T> | AsyncIterableIterator<T> {
        if (isIterable(this.iter)) {
            return this.iter;
        }

        throw new Error('Iter is not iterable.')
    }

    reverseValues(): IterableIterator<T> | AsyncIterableIterator<T> {
        if (isReversible(this.collection)) {
            return createReverseIterator(this.collection);
        }

        throw new Error('Iter is irreversible.')
    }

    reverse(): Iter<T> {
        if (isReversible(this.collection)) {
            return new Iter(createReverseIterator(this.collection));
        }

        throw new Error('Iter is irreversible.')
    }

}