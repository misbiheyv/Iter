import type { IterableType } from "../interface";
import Range from "../range";
import { cast, isArrayLike, isIterable, isSyncIterable } from "../helpers";

export function intoIterator(obj: boolean): IterableIterator<number>;

export function intoIterator(obj: null | undefined): IterableIterator<undefined>;

export function intoIterator(obj: number): IterableIterator<number>;

export function intoIterator(obj: string): IterableIterator<string>;

export function intoIterator<T = unknown>(obj: ArrayLike<T>): IterableIterator<T>;

export function intoIterator<T extends Iterable<any>>(obj: T): IterableIterator<IterableType<T>>;

export function intoIterator<T extends AsyncIterable<any>>(obj: T): AsyncIterableIterator<IterableType<T>>;

export function intoIterator<T extends Object>(obj: T): IterableIterator<IterableType<T>>;

export function intoIterator(obj: unknown): IterableIterator<unknown> | AsyncIterableIterator<unknown> {
    if (obj == null) {
        return [].values();
    }

    if (obj === true) {
        return new Range(0, Infinity).values();
    }

    if (obj === false) {
        return new Range(-Infinity, -1).reverse();
    }

    if (typeof obj === 'number') {
        if (obj === 0) return [].values();

        const sign = obj / Math.abs(obj);

        if (sign === -1) return new Range(obj, sign).reverse();

        if (sign === 1) return new Range(sign, obj).values();
    }

    if (typeof obj === 'string') {
        return obj[Symbol.iterator]();
    }

    if (isArrayLike(obj)) {
        let cur = 0;
        const length = obj.length;

        return {
            [Symbol.iterator]() {
                return this;
            },
            next() {
                const res = {
                    value: (cur < length) ? obj[cur] : undefined,
                    done: cur === length
                };

                if (cur !== length) {
                    cur++;
                }

                return res;
            }
        };
    }

    if (typeof obj === 'object') {
        if (isIterable(obj)) {
            const
                key = isSyncIterable(obj) ? Symbol.iterator : Symbol.asyncIterator,
                iter = obj[key]();

            if ('return' in obj || 'throw' in obj) {
                return cast({
                    [key]() {
                        return this;
                    },

                    next: iter.next.bind(iter)
                });
            }

            return iter;
        }

        return Object.values(obj).values();
    }

    return [obj].values();
}