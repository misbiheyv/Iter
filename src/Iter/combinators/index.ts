export async function* chain(...iterables: (Iterable<unknown> | AsyncIterable<unknown>)[])
    : AsyncIterableIterator<unknown> {
    for (const iter of iterables) {
        for await (const el of iter) {
            yield el;
        }
    }
}

export async function* zip(...iterables: (Iterable<unknown> | AsyncIterable<unknown>)[])
    : AsyncIterableIterator<unknown> {
    const iters = iterables.map(el => el[Symbol.iterator]() ?? el[Symbol.asyncIterator]())

    while (true) {
        let tuple = [];

        for await (const iter of iters) {
            const cur = iter.next()
            if (cur.done) return;

            tuple.push(cur.value)
        }

        yield tuple;
    }
}

export async function* mapSeq(
    iterable: AsyncIterable<unknown> | Iterable<unknown>,
    handlers: ((el: any) => any)[]
): AsyncIterableIterator<unknown> {
    for await (const el of iterable) {
        yield handlers.reduce((acc, cur) => cur(acc), el);
    }
}