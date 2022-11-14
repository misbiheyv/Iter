export function random(min: number, max: number): IterableIterator<number> {
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return {
                done: false,
                value: (min + Math.floor(Math.random() * (max - min)))
            }
        }
    }
}

export function* seqSync(...iters: IterableIterator<unknown>[]): IterableIterator<unknown> {
    for (const iter of iters) {
        for (const el of iter) {
            yield el;
        }
    }
}

export async function* seqAsync(...iters: AsyncIterableIterator<unknown>[]): AsyncIterableIterator<unknown> {
    for (const iter of iters) {
        for await (const el of iter) {
            yield el;
        }
    }
}

export function* zipSync(...iters: IterableIterator<unknown>[]): IterableIterator<unknown> {
    while (true) {
        let tuple = [];

        for (const iter of iters) {
            const cur = iter.next()
            if (cur.done) return;

            tuple.push(cur.value)
        }

        yield tuple;
    }
}

export async function* zipAsync(...iters: AsyncIterableIterator<unknown>[]): AsyncIterableIterator<unknown> {
    while (true) {
        let tuple = [];

        for await (const iter of iters) {
            const cur = await iter.next()
            if (cur.done) return;

            tuple.push(cur.value)
        }

        yield tuple;
    }
}

export function* mapSeqSync(
    iterable: Iterable<unknown>,
    handlers: ((el: any) => any)[]
): IterableIterator<unknown> {
    for (const el of iterable) {
        yield handlers.reduce((acc, cur) => cur(acc), el);
    }
}

export async function* mapSeqAsync(
    iterable: AsyncIterable<unknown>,
    handlers: ((el: any) => any)[]
): AsyncIterableIterator<unknown> {
    for await (const el of iterable) {
        yield handlers.reduce((acc, cur) => cur(acc), el);
    }
}