import { AnyIterable, UpcastPrimitive, Num } from "../../interface";

export type Flat<T> = T extends AnyIterable<infer V>
    ? V extends AnyIterable<any> ? Flat<V> : UpcastPrimitive<V>
    : T;

export type ReqFlat<I, N extends Num> = {
    'done': I,
    'next': I extends AnyIterable<infer V>
        ? ReqFlat<V, Dec<N>>
        : I
}[N extends -1 ? 'done' : 'next'];

type Dec<N extends Num> = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][N];