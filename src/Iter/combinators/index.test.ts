import * as combinators from './index';
import { forEach, take } from "../modifiers";

describe('Combinators for iterators', () => {
    test('chain. Should links some iterators together.', async () => {
        const res = [];
        await forEach(
            combinators.seq([1,2,3], new Set([4,5,6])),
            el => res.push(el)
        );
        expect(res).toEqual([1,2,3,4,5,6]);
    });

    test('zip. Should iterates some other iterators simultaneously.', async () => {
        const res = [];
        await forEach(
            combinators.zip([1,2,3], new Set(['a','b'])),
            el => res.push(el)
        );
        expect(res).toEqual([[1, 'a'], [2, 'b']]);
    });

    test('mapSeq. Should executes all functions on every element.', async () => {
        const res = [];
        await forEach(
            combinators.mapSeq([1,2,3], [el => el ** 2, el => el + 2]),
            el => res.push(el)
        );
        expect(res).toEqual([3,6,11]);
    });

})