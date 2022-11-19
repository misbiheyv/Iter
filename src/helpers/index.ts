import type { ExtendableCollection, Reversible } from "../interface";


export function cast<T>(obj: unknown): T {
    return <T>obj;
}

export function sleep(ms: number, payload?: any) {
    return new Promise(res => setTimeout(res, ms, payload));
}

export const isAsyncIterable = (obj: unknown): obj is AsyncIterable<unknown> =>
    typeof obj[Symbol.asyncIterator] === "function";


export const isSyncIterable = (obj: unknown): obj is Iterable<unknown> =>
    typeof obj[Symbol.iterator] === "function";


export const isIterable = (obj: unknown): obj is AsyncIterable<any> | Iterable<any> =>
    isAsyncIterable(obj) || isSyncIterable(obj);


export const isReversible = (o: any): o is Reversible<any> =>
    o instanceof Array || typeof o.reverse === 'function';


export function isArrayLike(o: unknown): o is ArrayLike<any> {
    const length = o['length'];

    if (o == null || typeof o !== 'object' || typeof length !== "number") return false;

    if (length === 0) return true;

    if (length > 0) return o[length - 1] != null;

    return false;
}

export function createReverseIterator<T>(iterable: Iterable<T> | AsyncIterable<T>) {

    if (iterable instanceof Array) {
        const gen = async function* () {
            for (let i = iterable.length - 1; i >= 0; i--) {
                yield await iterable[i]
            }
        }

        return gen()
    }

    if (isReversible(iterable)) {
        return iterable.reverse();
    }
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