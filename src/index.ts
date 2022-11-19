import { IterableType } from "./interface";

import Iter from "./iter";

import { intoIterator } from "./into-iterator";


export default function intoIter(obj: boolean): Iter<number>;

export default function intoIter(obj: null | undefined): Iter<undefined>;

export default function intoIter(obj: number): Iter<number>;

export default function intoIter(obj: string): Iter<string>;

export default function intoIter<T = unknown>(obj: ArrayLike<T>): Iter<T>;

export default function intoIter<T extends Iterable<any>>(obj: T): Iter<IterableType<T>>;

export default function intoIter<T extends AsyncIterable<any>>(obj: T): Iter<IterableType<T>>;

export default function intoIter<T extends Object>(obj: T): Iter<IterableType<T>>;

export default function intoIter(obj: unknown): Iter<unknown> {
    return new Iter(intoIterator(obj));
}

export { intoIterator };

export * from './iterators';