import * as combinators from './index';

const createAsyncIter = (count = 3) => {
    let i = 0;

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next: () => {
            return new Promise(res => setTimeout(() => res(++i), 50))
                .then(res => ({
                    done: i > count,
                    value: i
                }))
        }
    }
};

describe('Combinators for iterators', () => {
    test('seq', async () => {
        expect([...combinators.seqSync([1,2].values(), [3, 4].values(), [5,6].values())])
            .toEqual([1,2,3,4,5,6]);

        const
            res = [],
            iter = combinators.seqAsync(createAsyncIter(2), createAsyncIter(2));

        for await (const el of iter) {
            res.push(el)
        }

        expect(res).toEqual([1,2,1,2])
    });


    test('zip', async () => {
        expect([...combinators.zipSync([1,2].values(), [3, 4].values(), [5,6].values())])
            .toEqual([[1,3,5],[2,4,6]]);


        const
            res = [],
            iter = combinators.zipAsync(createAsyncIter(2), createAsyncIter(2));

        for await (const el of iter) {
            res.push(el)
        }

        expect(res).toEqual([[1,1],[2,2]])
    })

    test('mapSeq', async () => {
        expect([
            ...combinators.mapSeqSync([1,2,3].values(), [el => el ** 2, el => el + 1, el => `${el}`])
            ])
            .toEqual(['2', '5', '10']);

        const
            res = [],
            iter = combinators.mapSeqAsync(createAsyncIter(2), [el => el ** 2, el => el + 1, el => `${el}`]);

        for await (const el of iter) {
            res.push(el)
        }

        expect(res).toEqual(['2', '5'])
    })


    test('random', () => {
        let i = 0;

        do {
            let v = combinators.random(-3, 3).next().value;
            expect(v).toBeGreaterThanOrEqual(-3);
            expect(v).toBeLessThanOrEqual(3);
        } while  (i++ < 10);
    })
})