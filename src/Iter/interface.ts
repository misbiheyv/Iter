export type Optional<T> = T | null;

export type Modes = 'sync' | 'async';

export type Collection<T> = 
    { set(el: T): any } 
    | { add(el: T): any } 
    | { push(el: T): any }
    | { append(el: T): any };

export type ExtendableCollection<T> = {collection: Collection<T>, addToCollection(value: T): void}