import * as collectors from './index';

let iter;
let asyncIter;

describe('Collectors for iterators', () => {
    beforeEach(() => {
        iter = [1, 2, 3].values();

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
    })

    test('toArray. Should return new Array with collected iter values', async () => {
        const array = await collectors.toArray(iter)
        expect(array).toEqual([1, 2, 3])

        const array1 = await collectors.toArray(asyncIter)
        expect(array1).toEqual([10, 20, 30])
    });

    test('collect. Should collect iterator into passed Collection (returns new Collection)', async () => {
        const set = await collectors.collect(iter, new Set([11, 22]));
        expect(set).toEqual(new Set([11, 22, 1, 2, 3]));

        const set1 = await collectors.collect(asyncIter, new Set([11,22]));
        expect(set1).toEqual(new Set([11, 22, 10, 20, 30]));
    });

    test('collect. Should collect iterator into passed Array (returns new Array)', async () => {

        const arr = await collectors.collect(iter, [11, 22]);
        expect(arr).toEqual([11, 22, 1, 2, 3]);

        const arr1 = await collectors.collect(asyncIter, [11, 22]);
        expect(arr1).toEqual([11, 22, 10, 20, 30]);
    });

})