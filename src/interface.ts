export type AnyIterable<T> = Iterable<T> | AsyncIterable<T>;

export type IterableType<T> = T extends AnyIterable<infer T> ? T : unknown;

export type Reversible<T> = { reverse: () => AnyIterable<T> };

export type UpcastPrimitive<T> = [string, number, boolean, bigint, unknown][
    T extends string ? 0
    : T extends number ? 1
    : T extends boolean ? 2
    : T extends bigint ? 3
    : 4
];

export type Num = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type Collection<T> =
    { set(el: T): any }
    | { add(el: T): any }
    | { push(el: T): any }
    | { append(el: T): any };

export type ExtendableCollection<T> = {
    collection: Collection<T>,
    addToCollection(value: T): void
};

export type ExtractIterablesType<T extends AnyIterable<any>[]> =
    T[number] extends AnyIterable<infer U> ? U : unknown;