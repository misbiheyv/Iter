export async function sum<T  extends unknown>(
    iter: Iterable<T> | AsyncIterable<T>,
    mapper?: (value: T) => number
): Promise<number> {
    let
        sum = 0;

    for await (const el of iter) {
        sum += mapper ? mapper(el) : <number>el
    }

    return sum;
}

export async function avg<T extends unknown>(
    iter: Iterable<T> | AsyncIterable<T>,
    mapper?: (num: T) => number
): Promise<number> {
    let 
        sum = 0,
        count = 0;

    for await (const el of iter) {
        sum += mapper ? mapper(el) : <number>el;
        count++
    }

    return sum/count;
}

export async function max<T extends unknown>(
    iter: Iterable<T> | AsyncIterable<T>,
    mapper?: (num: T) => number
): Promise<number> {
    let
        max = Number.MIN_SAFE_INTEGER;

    for await (const e of iter) {
        const el = mapper ? mapper(e) : <number>e;
        max = el > max ? el : max;
    }

    return max;
}

export async function min<T extends unknown>(
    iter: Iterable<T> | AsyncIterable<T>,
    mapper?: (el: T) => number
): Promise<number> {
    let
        min = Number.MAX_SAFE_INTEGER;

    for await (const e of iter) {
        const el = mapper ? mapper(e) : <number>e;
        min = el < min ? el : min;
    }

    return min;
}