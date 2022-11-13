export interface AbstractIter<T> {
    map(args: any): any;

    filter(args: any): any;

    flatMap(args: any): any;

    flatten(args: any): any;

    collect(args: any): any;

    toArray();
    
    [Symbol.iterator] (): IterableIterator<T>;
    values (): IterableIterator<T>
    
    [Symbol.asyncIterator] (): AsyncIterableIterator<T>;
    asyncValues (): AsyncIterableIterator<T>
}

export type Optional<T> = T | null;

export type Modes = 'sync' | 'async';

export type Collection<T> = 
    { set(el: T): any } 
    | { add(el: T): any } 
    | { push(el: T): any }
    | { append(el: T): any };

export type ExtendableCollection<T> = {collection: Collection<T>, addToCollection(value: T): void}