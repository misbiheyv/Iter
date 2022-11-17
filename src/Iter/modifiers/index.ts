import { isIterable, cast, sleep } from '../../helpers';


export async function* map<T, R>(
    iter: Iterable<T> | AsyncIterable<T>,
    cb: (el: T, index?: number, iter?: unknown) => R
): AsyncGenerator<R> {
    for await (const el of iter) {
        yield cb(el);
    }
}

export async function* filter<V>(
    iter: Iterable<V> | AsyncIterable<V>,
    cb: (el: V, index?: number, iter?: unknown) => boolean
): AsyncGenerator<V> {
    for await (const el of iter) {
        if (!cb(el)) continue;
        yield el;
    }
}

//TODO Сделать нормальную типизацию
export async function* flatten<T>(
    iter: Iterable<T> | AsyncIterable<T>,
    depth: number = 1
): AsyncGenerator<T> {
    for await (const el of iter) {
        if (isIterable(el) && typeof el !== 'string' && depth > 0)
            yield* flatten(cast(el), depth - 1)
        else
            yield el
    }
}

//TODO Сделать нормальную типизацию
export async function* flatMap<T, R>(
    iter: Iterable<T> | AsyncIterable<T>,
    cb: (el: unknown, index?: number, iter?: unknown) => R
) : AsyncGenerator<R> {

    for await (const el of iter) {
        if (isIterable(el) && typeof el !== 'string') {
            yield* flatMap(el, cb)
        } else {
            yield cb(<T>el)
        }
    }
}

export async function* take<T>(
    iter: Iterable<T> | AsyncIterable<T>,
    count: number
): AsyncGenerator<T> {
    let i = 0;

    for await (const el of iter) {
        if (i++ >= count) {
            return;
        }
        yield el;
    }
}

export async function forEach<T>(
    iter: AsyncIterable<T> | Iterable<T>,
    cb: (el: unknown, index: number, iter: unknown) => void
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


export async function* enumerate<T>(iter: Iterable<T> | AsyncIterable<T>): AsyncGenerator<[number, T]> {
    let i = 0;

    for await (const el of iter) {
        yield [i++, el];
    }
}


export async function* inRange<T>(
    iter: Iterable<T> | AsyncIterable<T>,
    start: number,
    end?: number
): AsyncGenerator<T> {
    let i = 0;

    for await (const el of iter) {
        if (i++ < start) continue;
        if (end != null && i > end + 1) return;
        yield el;
    }
}

export async function* cycle<T>(iterable: AsyncIterable<T> | Iterable<T>): AsyncGenerator<T> {
    let
        iter = iterable[Symbol.iterator](),
        cache = [],
        i = 0;

    while (true) {
        for await (const el of iter) {
            cache.push(el);
            yield el;
        }

        yield cache[i++ % cache.length];
    }
}

export async function chunkedForEach<T, I extends Iterable<T> | AsyncIterable<T>>(
    iter: I,
    cb: (el: T, index: number, iter: I extends Iterable<T> ? Iterable<T> : AsyncIterable<T>) => void
) {
    return executor(_forEach(iter, cb), undefined);
}

async function *_forEach<T>(
    iter: AsyncIterable<T> | Iterable<T>,
    cb: (el: T, index?: number, iter?: unknown) => void
): AsyncGenerator {
    let time = Date.now();
    let i = 0;
    for await (const el of iter) {
        cb(el, i++, iter);

        if (Date.now() - time > 100) {
            yield;
            time = Date.now();
        }
    }
}

async function executor(iter: Generator | AsyncGenerator, value) {
    await sleep(100);

    let
        res         = await iter.next(value),
        promisified = Promise.resolve(res);

    if (res.done) return promisified;

    return promisified
        .then((res) => {
            return executor(iter, res.value);
        })

        .catch(async (err) => {
            if (typeof iter.throw === 'function') {
                res = await iter.throw(err)
            }

            if (res.done) return res.value;

            return executor(iter, res.value);
        })
}