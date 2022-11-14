import * as modifiers from './index';

let iter: IterableIterator<number>;
let deepIter: IterableIterator<any>;
let asyncIter: AsyncIterableIterator<number>;
let asyncDeepIter: AsyncIterableIterator<any>;
let asyncFilterIter: AsyncIterableIterator<number>;

describe('Modifiers for iterators', () => {
    beforeAll(() => {
        asyncFilterIter = (() => {
            let i = 0;

            return {
                [Symbol.asyncIterator]() {
                    return this;
                },
                next: () => {
                    return new Promise(res => setTimeout(() => res(++i), 100))
                        .then(res => ({
                            done: i > 5,
                            value: i
                        }))
                }
            }
        })();
    });

    beforeEach(() => {
        iter = [1, 2, 3].values();
        deepIter = [1, [[2], [[3]]]].values();

        asyncIter = (() => {
            let i = 0;

            return {
                [Symbol.asyncIterator]() {
                    return this;
                },
                next: () => {
                    return new Promise(res => setTimeout(() => res(++i), 100))
                        .then(res => ({
                            done: i > 3,
                            value: i * 10
                        }))
                }
            }
        })();

        asyncDeepIter = (() => {
            let i = 0;

            return {
                [Symbol.asyncIterator]() {
                    return this;
                },
                next: () => {
                    return new Promise(res => setTimeout(() => res(++i), 100))
                        .then(res => ({
                            done: i > 2,
                            value: new Set([i * 10, i * 10 + 1])
                        }))
                }
            }
        })();
    });

    test('sync and async map', async () => {

        expect([...modifiers.mapSync(iter, el => el ** 2)])
            .toEqual([1, 4, 9]);

        const
            res = [],
            it = modifiers.mapAsync(asyncIter, el => el ** 2).asyncValues();

        for await (const el of it) {
            res.push(el);
        }

        expect(res).toEqual([100, 400, 900])
    })

    test('sync and async filter', async () => {
        expect([...modifiers.filterSync(iter, el => el % 2 === 0)]).toEqual([2]);

        const
            res = [],
            it = modifiers.filterAsync(asyncFilterIter, el => el % 2 === 0);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([2, 4])
    })

    test('sync and async flatten', async () => {
        expect([...modifiers.flattenSync([[[1],[2]],[[3]]].values(), 1)])
            .toEqual([[1], [2], [3]]);

        expect([...modifiers.flattenSync([[[1],[2]],[[3]]].values(), 2)])
            .toEqual([1, 2, 3]);

        const
            res = [],
            it = modifiers.flattenAsync(asyncDeepIter, 1);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([10, 11, 20, 21])
    })

    test('sync and async flatMap', async () => {

        expect([...modifiers.flatMapSync(deepIter, (el: any) => el ** 2)])
            .toEqual([1, 4, 9]);

        const
            res = [],
            it = modifiers.flatMapAsync(asyncDeepIter, (el: any) => el ** 2).asyncValues();

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([100, 121, 400, 441])
    })

    test('sync and async take', async () => {
        expect([...modifiers.take([1,2,3,4,5].values(), 3).values()])
            .toEqual([1, 2, 3]);

        const
            res = [],
            it = modifiers.take(asyncIter, 2, 'async').asyncValues();

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([10, 20])
    })

    test('async and async enumerate', async () => {
        expect([...modifiers.enumerate(['a', 'b', 'c'][Symbol.iterator]())])
            .toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);

        const
            res = [],
            it = modifiers.enumerate(asyncIter);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([[0, 10], [1, 20], [2, 30]])
    })

    test('async and async fromRange', async () => {

        expect([...modifiers.fromRange([1,2,3,4,5,6].values(), 1, 3)])
            .toEqual([2, 3, 4]);

        const
            res = [],
            it = modifiers.fromRange(asyncIter, 1, 3);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([20, 30])
    })

    test('async and async forEach', async () => {
        let res = [];
        modifiers.forEach([1,2,3].values(), async (el) => {
            res.push(el + 1)
        });
        expect(res).toEqual([2, 3, 4])

        res = [];
        await modifiers.asyncForEach(asyncIter, (el) => {
            res.push(el + 1)
        });

        expect(res).toEqual([11,21,31])
    })
})