export type Reversible = { reverse: () => IterableIterator<any> }

export type Collection<T> =
    { set(el: T): any } 
    | { add(el: T): any } 
    | { push(el: T): any }
    | { append(el: T): any };

export type ExtendableCollection<T> = {collection: Collection<T>, addToCollection(value: T): void}