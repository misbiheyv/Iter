import type { ExtendableCollection } from "../Iter/interface";

export function intoIterator<T>(iterable: Iterable<T>): IterableIterator<T>;
export function intoIterator<T>(asyncIterable: AsyncIterable<T>): AsyncIterableIterator<T>;

export function intoIterator<T>(iterable: Iterable<T> | AsyncIterable<T>)
    : IterableIterator<T> | AsyncIterableIterator<T> {

    let
        iter;

    if (isSyncIterable(iterable)) {
        iter = iterable[Symbol.iterator]();
        return {
            [Symbol.iterator]() {
                return this;
            },
            next() {
                return iter.next()
            }
        }
    }

    iter = iterable[Symbol.asyncIterator]();
    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next() {
            return iter.next();
        }
    }
}

export function isIterable(obj: unknown): obj is AsyncIterable<any> | Iterable<any> {
    return isAsyncIterable(obj) || isSyncIterable(obj);
}

export function isAsyncIterable(obj: unknown): obj is AsyncIterable<unknown> {
    return typeof obj[Symbol.asyncIterator] === "function";
}

export function isSyncIterable(obj: unknown): obj is Iterable<unknown> {
    return typeof obj[Symbol.iterator] === "function";
}


export function addToCollection<T>(this: ExtendableCollection<T>, el: T) {
    if ('add' in this.collection) {
        this.collection.add(el)
        return;
    }

    if ('set' in this.collection) {
        this.collection.set(el)
        return;
    }

    if ('push' in this.collection) {
        this.collection.push(el)
        return;
    }

    if ('append' in this.collection) {
        this.collection.append(el)
        return;
    }
}

export function cast<T>(obj: unknown): T {
    return <T>obj;
}

export function sleep(ms: number, payload?: any) {
    return new Promise(res => setTimeout(res, ms, payload));
}