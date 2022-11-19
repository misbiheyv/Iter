import type { 

    Collection, 
    ExtendableCollection 

} from '../../interface';

import { addToCollection } from "../../helpers";

export async function toArray<T>(iter: Iterable<T> | AsyncIterable<T>): Promise<T[]> {
    const res: T[] = []

    for await (const el of iter) {
        res.push(el)
    }

    return res;
}


export async function collect<T>(iter: Iterable<T> | AsyncIterable<T>, collection: Array<T>)
    : Promise<Array<T>>;
export async function collect<T>(iter: Iterable<T> | AsyncIterable<T>, collection: Collection<T>)
    : Promise<Collection<T>>;

export async function collect<T>(iter: Iterable<T> | AsyncIterable<T>, collection: Collection<T> | Array<T>,)
    : Promise<Collection<T> | Array<T>> {

    if (collection instanceof Array) {
        return toArray(iter).then(res => [...collection, ...res]);
    }

    const res: ExtendableCollection<T> = { collection, addToCollection };

    for await (const el of iter) {
        res.addToCollection(el)
    }

    return res.collection;
}