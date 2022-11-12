import {

    isAsyncIterable,
    isSyncIterable

} from '../../helpers'

export async function sum(
    iter: IterableIterator<number> | AsyncIterableIterator<number>
): Promise<number> {
    let sum = 0;

    if (isSyncIterable(iter)) {
        for (const el of iter) {
            sum += el;
        }
    } else if (isAsyncIterable(iter)) {
        for await (const el of iter) {
            sum += el;
        }
    } else {
        throw new Error('Passed argument is not iterable.')
    }

    return sum;
}

export async function avg(
    iter: IterableIterator<number> | AsyncIterableIterator<number>,
    round: (num: number) => number = Math.round
): Promise<number> {
    let 
        sum = 0,
        count = 0;

    if (isSyncIterable(iter)) {
        for (const el of iter) {
            sum += el;
            count++
        }
    } else if (isAsyncIterable(iter)) {
        for await (const el of iter) {
            sum += el;
            count++;
        }
    } else {
        throw new Error('Passed argument is not iterable.')
    }

    return round(sum/count);
}

export async function max(
    iter: IterableIterator<number> | AsyncIterableIterator<number>
): Promise<number> {
    let max = Number.MIN_SAFE_INTEGER;

    if (isSyncIterable(iter)) {

        for (const el of iter) {
            max = el > max ? el : max;
        }
    } else if(isAsyncIterable(iter)) {

        for await (const el of iter) {
            max = el > max ? el : max;
        }
    } else {
        throw new Error('Passed argument is not iterable.')
    }

    return max;
}

export async function min(
    iter: IterableIterator<number> | AsyncIterableIterator<number>
): Promise<number> {
    let min = Number.MAX_SAFE_INTEGER;

    if (isSyncIterable(iter)) {

        for (const el of iter) {
            min = el < min ? el : min;
        }
    } else if(isAsyncIterable(iter)) {

        for await (const el of iter) {
            min = el < min ? el : min;
        }
    } else {
        throw new Error('Passed argument is not iterable.')
    }

    return min;
}