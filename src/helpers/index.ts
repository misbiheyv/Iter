export function intoAsyncIterator<T>(iterable: AsyncIterable<T>): AsyncIterableIterator<T> {
    const iter = iterable[Symbol.asyncIterator]();

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next() {
            return iter.next()
        }
    }
}

export function intoIterator<T>(iterable: Iterable<T>): IterableIterator<T> {
    const iter = iterable[Symbol.iterator]();

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return iter.next()
        }
    }
}

export function isAsyncIterable(obj: unknown): obj is AsyncIterable<unknown> {
    return typeof obj[Symbol.asyncIterator] === "function";
}

export function isSyncIterable(obj: unknown): obj is Iterable<unknown> {
    return typeof obj[Symbol.iterator] === "function";
}