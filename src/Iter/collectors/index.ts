import type { 

    Collection, 
    ExtendableCollection 

} from '../interface';

import { 

    isAsyncIterable, 
    isSyncIterable, 
    addToCollection

} from "../../helpers";

export async function toArray<T>(iter: IterableIterator<T> | AsyncIterableIterator<T>): Promise<T[]> {
    const res: T[] = []

    if (isAsyncIterable(iter)) {
            for await (const el of iter) {
                res.push(el)
            }

    } else {
        for (const el of iter) {
            res.push(el)
        }
    }
    
    return res;
}

export async function collect<T>(
    iter: IterableIterator<T> | AsyncIterableIterator<T>,
    collection: Collection<T> | Array<T>,
): Promise<Collection<T> | Array<T>> {
    if (collection instanceof Array) {
        return toArray(iter).then(res => [...collection, ...res]);
    }

    const res: ExtendableCollection<T> = { collection, addToCollection };

    if (isAsyncIterable(iter)) {
        for await (const el of iter) {
            res.addToCollection(el)
        }
    } else if (isSyncIterable) {
        for (const el of iter) {
            res.addToCollection(el)
        }
    } else {
        throw new Error('Passed argument is not iterable.')
    }

    return res.collection;
}