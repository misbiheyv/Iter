export type AnyIterable<T> = Iterable<T> | AsyncIterable<T>;

export type Reversible<T> = { reverse: () => AnyIterable<T> };

export type Collection<T> =
    { set(el: T): any } 
    | { add(el: T): any } 
    | { push(el: T): any }
    | { append(el: T): any };

export type ExtendableCollection<T> = {
    collection: Collection<T>,
    addToCollection(value: T): void
};

export type IterableType<T> = T extends AnyIterable<infer T> ? T : unknown;

export type ExtractZipType<A extends AnyIterable<any>[]> = {
    0: [],
    1: A extends [...infer T] ? ReqType<T, []> : unknown;
}[A extends [] ? 0 : 1];

export type ExtractIterablesType<T extends AnyIterable<any>[]> =
    T[number] extends AnyIterable<infer U> ? U : unknown;

export type UpcastPrimitive<T> = [string, number, boolean, bigint, unknown][
    T extends string ? 0
    : T extends number ? 1
    : T extends boolean ? 2
    : T extends bigint ? 3
    : 4
];

export type Flat<T> = T extends AnyIterable<infer V>
    ? V extends AnyIterable<any> ? Flat<V> : UpcastPrimitive<V>
    : T;

export type ReqFlat<I, N extends Num> = {
    'done': I,
    'next': I extends AnyIterable<infer V>
        ? ReqFlat<V, Dec<N>>
        : I
}[N extends -1 ? 'done' : 'next'];

export type Num = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

type Dec<N extends Num> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][N];

type Head<A extends any[]> = {
    0: never,
    1: A extends [infer T, ...any] ? T : unknown
}[A extends [] ? 0 : 1];

type Tail<A extends any[]> = {
    0: [],
    1: A extends [any, ...infer T] ? T : [unknown]
}[A extends [] ? 0 : 1];

type ReqType<H extends any[], T extends any[]> = {
    0: T;
    1: ReqType<Tail<H>, [...T, IterableType<Head<H>>]>;
}[H['length'] extends 0 ? 0 : 1];