import {

    isAsyncIterable,
    isSyncIterable

} from '../../helpers'

export async function sum<T  extends unknown>(
    iter: IterableIterator<T> | AsyncIterableIterator<T>,
    fn?: (value: T) => number
): Promise<number> {
    let
        sum = 0;
    const
        add = (el: T) => sum += fn ? fn(el) : <number>el;

    if (isSyncIterable(iter)) {
        for (const el of iter) {
            add(el)
        }
        return sum;
    }

    if (isAsyncIterable(iter)) {
        for await (const el of iter) {
            add(el)
        }
        return sum;
    }

    throw new Error('Passed argument is not iterable.')
}

export async function avg<T extends unknown>(
    iter: IterableIterator<T> | AsyncIterableIterator<T>,
    fn?: (num: T) => number
): Promise<number> {
    let 
        sum = 0,
        count = 0;

    const add = (el: T) => {
        sum += fn ? fn(el) : <number>el;
        count++
    }

    if (isSyncIterable(iter)) {
        for (const el of iter) {
            add(el)
        }
        return sum/count;
    }

    if (isAsyncIterable(iter)) {
        for await (const el of iter) {
            add(el)
        }
        return sum/count;
    }

    throw new Error('Passed argument is not iterable.')
}

export async function max<T extends unknown>(
    iter: IterableIterator<T> | AsyncIterableIterator<T>,
    fn?: (num: T) => number
): Promise<number> {
    let
        max = Number.MIN_SAFE_INTEGER;

    const compare = (e: T) => {
        const el = fn ? fn(e) : <number>e;
        max = el > max ? el : max;
    }

    if (isSyncIterable(iter)) {
        for (const e of iter) {
            compare(e)
        }
        return max;
    }

    if (isAsyncIterable(iter)) {
        for await (const e of iter) {
            compare(e)
        }
        return max;
    }

    throw new Error('Passed argument is not iterable.')
}

export async function min<T extends unknown>(
    iter: IterableIterator<T> | AsyncIterableIterator<T>,
    fn?: (el: T) => number
): Promise<number> {
    let
        min = Number.MAX_SAFE_INTEGER;

    const compare = (e: T) => {
        const el = fn ? fn(e) : <number>e;
        min = el < min ? el : min;
    }

    if (isSyncIterable(iter)) {
        for (const e of iter) {
            compare(e)
        }
        return min;
    }

    if (isAsyncIterable(iter)) {
        for await (const e of iter) {
            compare(e)
        }
        return min;
    }

    throw new Error('Passed argument is not iterable.');
}