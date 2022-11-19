import type {

    AnyIterable,
    ExtractIterablesType,
    ExtractZipType

} from "../../interface";

import { cast } from "../../helpers";

export async function* seq<T extends AnyIterable<any>[]>(...iterables: T)
    : AsyncGenerator<ExtractIterablesType<T>> {
    for (const iter of iterables) {
        for await (const el of cast<any>(iter)) {
            yield el;
        }
    }
}

export async function* zip<T extends AnyIterable<any>[]>(...iterables: T)
    : AsyncGenerator<ExtractZipType<T>> {
    const iters = iterables.map(el => el[Symbol.iterator]() ?? el[Symbol.asyncIterator]())

    while (true) {
        let tuple = [];

        for await (const iter of iters) {
            const cur = iter.next()
            if (cur.done) return;

            tuple.push(cur.value)
        }

        yield cast(tuple);
    }
}

//TODO Нормально типизировать
export async function* mapSeq(

    iterable: AnyIterable<unknown>,
    handlers: ((el: any) => any)[]

): AsyncIterableIterator<unknown> {
    for await (const el of iterable) {
        yield handlers.reduce((acc, cur) => cur(acc), el);
    }
}