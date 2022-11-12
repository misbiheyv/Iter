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
    }

    return sum;
}

export async function avg(
    iter: IterableIterator<number> | AsyncIterableIterator<number>
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
    }

    return sum/count | 0;
}