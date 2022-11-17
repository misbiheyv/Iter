import Iter from "./index";
import { sleep } from "../helpers";
import {forEach} from "./modifiers";
import * as combinators from "./combinators";

const createReversible = () => ({
    *[Symbol.iterator]() {
        let i = 0;
        while (i++ > 3) {
            yield i;
        }
    },
    *reverse() {
        let i = 4;
        while (--i > 0) {
            yield i;
        }
    }
})

describe('Iter', () => {
    describe('methods iterators', () => {

        test('values', async () => {
            const
                res = [],
                iter = await new Iter([1,2,3]).values();

            for await (const el of iter) {
                res.push(el)
            }

            expect(res).toEqual([1,2,3]);
        });

        test('reverseValues', async () => {
            const
                res = [],
                iter = await new Iter([1,2,3]).reverseValues();

            for await (const el of iter) {
                res.push(el)
            }
            expect(res).toEqual([3,2,1]);
        });

        test('[Symbol.iterator]', async () => {
            const res = [...new Iter([1,2,3])]
            expect(res).toEqual([1,2,3]);
        });

        test('reverse array', async () => {
            const res = [];
            await new Iter([1,2,3]).reverse().forEach(el => res.push(el));
            expect(res).toEqual([3,2,1]);
        });

        test('reverse reversible collection', async () => {
            const res = [];
            await new Iter(createReversible()).reverse().forEach(el => res.push(el));
            expect(res).toEqual([3,2,1]);
        });

        test('reverse irreversible', () => {
            expect(() => new Iter(new Set([1,2,3])).reverse())
                .toThrowError('Iter is irreversible.');
        });

        test('forEach', async () => {
            const res = [];
            await new Iter([1,2,3]).forEach(el => res.push(el + 1));
            expect(res).toEqual([2,3,4]);
        });

        test('chunkedForEach', async () => {
            const res = [];
            await new Iter([1,2,3]).forEachChunked(el => res.push(el + 1));
            expect(res).toEqual([2,3,4]);

            let
                i = 0;

            new Iter(new Array(10e6)).forEachChunked((_, ind) => i = ind);
            await sleep(500);
            expect(i).toBeGreaterThan(0);
        });

    });

    describe('methods modifiers', () => {

        //foreach and chunkedForeach

        test('map', async () => {
            const res = [];
            await new Iter([1,2,3]).map(el => el ** 2).forEach(el => res.push(el));
            expect(res).toEqual([1, 4, 9]);
        });

        test('filter', async () => {
            const res = [];
            await new Iter([1,2,3,4,5]).filter(el => el % 2 === 0).forEach(el => res.push(el));
            expect(res).toEqual([2, 4]);
        });

        test('flatten', async () => {
            const res = [];
            await new Iter([1,[2,[3]]]).flatten(1).forEach(el => res.push(el));
            expect(res).toEqual([1, 2, [3]]);
        });

        test('flatMap', async () => {
            const res = [];
            await new Iter([1,[2,[3]]]).flatMap((el: number) => el ** 2).forEach(el => res.push(el));
            expect(res).toEqual([1, 4, 9]);
        });

        test('take', async () => {
            const res = [];
            await new Iter([1,2,3,4,5]).take(3).forEach(el => res.push(el));
            expect(res).toEqual([1, 2, 3]);
        });

        test('inRange', async () => {
            let res = [];
            await new Iter([1,2,3,4,5]).inRange(1, 3).forEach(el => res.push(el));
            expect(res).toEqual([2, 3, 4]);

            res = [];
            await new Iter([1,2,3,4,5]).inRange(2).forEach(el => res.push(el));
            expect(res).toEqual([3, 4, 5]);
        });

        test('cycle', async () => {
            let res = [];
            await new Iter([1,2,3]).cycle().take(8).forEach(el => res.push(el));
            expect(res).toEqual([1,2,3,1,2,3,1,2]);
        });

        test('enumerate', async () => {
            let res = [];
            await new Iter(['a', 'b']).enumerate().forEach(el => res.push(el));
            expect(res).toEqual([[0, 'a'], [1, 'b']]);
        });

    });

    describe('methods aggregators', () => {

        test('sum', async () => {
            let res = await new Iter([1,2,3]).sum();
            expect(res).toBe(6);

            res = await new Iter([{amount: 1}, {amount: 2}, {amount: 3}]).sum(el => el.amount);
            expect(res).toBe(6);
        });

        test('avg', async () => {
            let res = await new Iter([1,2,3]).avg();
            expect(res).toBe(2);

            res = await new Iter([{amount: 1}, {amount: 2}, {amount: 3}]).avg(el => el.amount);
            expect(res).toBe(2);
        });

        test('max', async () => {
            let res = await new Iter([1,2,3]).max();
            expect(res).toBe(3);

            res = await new Iter([{amount: 1}, {amount: 2}, {amount: 3}]).max(el => el.amount);
            expect(res).toBe(3);
        });

        test('min', async () => {
            let res = await new Iter([1,2,3]).min();
            expect(res).toBe(1);

            res = await new Iter([{amount: 1}, {amount: 2}, {amount: 3}]).min(el => el.amount);
            expect(res).toBe(1);
        });

    });

    describe('methods collectors', () => {
        test('toArray', async () => {
            let res = await new Iter([1,2,3]).toArray();
            expect(res).toEqual([1,2,3]);
        });

        test('collect into extendable collection', async () => {
            let res = await new Iter([1,2,3]).collect(new Set());
            expect(res).toEqual(new Set([1,2,3]));

            res = await new Iter([3,4,5]).collect(new Set([1,2]));
            expect(res).toEqual(new Set([1,2,3,4,5]));
        });

        test('collect into Array', async () => {
            let res = await new Iter([1,2,3]).collect([]);
            expect(res).toEqual([1,2,3]);

            res = await new Iter([3,4,5]).collect([1,2]);
            expect(res).toEqual([1,2,3,4,5]);
        });
    });

    describe('methods combinators', () => {
        test('chain', async () => {
            const res = [];
            await new Iter([1,2,3]).chain(new Set([4,5,6])).forEach(el => res.push(el))
            expect(res).toEqual([1,2,3,4,5,6]);
        })

        test('zip', async () => {
            const res = [];
            await new Iter([1,2,3]).zip(new Set(['a','b'])).forEach(el => res.push(el))
            expect(res).toEqual([[1, 'a'], [2, 'b']]);
        })

        test('mapSeq', async () => {
            const res = [];
            await new Iter([1,2,3]).mapSeq([el => el ** 2, el => el + 1]).forEach(el => res.push(el));
            expect(res).toEqual([2,5,10]);
        })
    });

    describe('static methods', () => {
        test('seq', async () => {
            const res = [];
            await Iter.seq([1,2,3], new Set([4,5,6])).forEach(el => res.push(el))
            expect(res).toEqual([1,2,3,4,5,6]);
        });

        test('zip', async () => {
            const res = [];
            await Iter.zip([1, 2], new Set(['a','b'])).forEach(el => res.push(el))
            expect(res).toEqual([[1, 'a'], [2, 'b']]);
        });

        test('random', async () => {
            await new Iter(Iter.random(-3, 3)).take(10).forEach(el => {
                expect(el).toBeGreaterThanOrEqual(-3);
                expect(el).toBeLessThanOrEqual(3);
            })
        })
    })
})