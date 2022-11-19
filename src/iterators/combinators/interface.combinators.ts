import { AnyIterable, IterableType } from "../../interface";

export type ExtractZipType<A extends AnyIterable<any>[]> = {
    0: [],
    1: A extends [...infer T] ? ReqType<T, []> : unknown;
}[A extends [] ? 0 : 1];


type ReqType<H extends any[], T extends any[]> = {
    0: T;
    1: ReqType<Tail<H>, [...T, IterableType<Head<H>>]>;
}[H['length'] extends 0 ? 0 : 1];

type Head<A extends any[]> = {
    0: never,
    1: A extends [infer T, ...any] ? T : unknown
}[A extends [] ? 0 : 1];

type Tail<A extends any[]> = {
    0: [],
    1: A extends [any, ...infer T] ? T : [unknown]
}[A extends [] ? 0 : 1];