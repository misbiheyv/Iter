import Iter from ".";

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

const createDeepAsyncIter = () => {
    let i = 0;

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next: () => {
            return new Promise(res => setTimeout(() => res(++i), 50))
                .then(res => ({
                    done: i > 3,
                    value: [[i]]
                }))
        }
    }
};

describe('Iter', () => {

    test('sync iterators', () => {
        expect([...new Iter([1, 2, 3])]).toEqual([1, 2, 3]);

        expect([...new Iter([1, 2, 3]).values()]).toEqual([1, 2, 3]);
    })

    test('async iterators', async () => {
        let
            res = [],
            it = new Iter(createAsyncIter());

        for await (const el of it) {
            res.push(el)
        }
        expect(res).toEqual([1, 2, 3])

        for await (const el of it.asyncValues()) {
            res.push(el)
        }
        expect(res).toEqual([1, 2, 3])
    })

    test('aggregators', async () => {
        expect(await new Iter([1, 2, 3]).avg()).toBe(2);

        expect(await new Iter([1, 2, 3]).sum()).toBe(6);

        expect(await new Iter([1, 2, 3]).min()).toBe(1);

        expect(await new Iter([1, 2, 3]).max()).toBe(3);


        expect(await new Iter(createAsyncIter()).avg()).toBe(2);

        expect(await new Iter(createAsyncIter()).sum()).toBe(6);

        expect(await new Iter(createAsyncIter()).min()).toBe(1);

        expect(await new Iter(createAsyncIter()).max()).toBe(3);
    })

    test('collectors', async () => {
        expect(await new Iter([1, 2, 3]).toArray())
            .toEqual([1, 2, 3]);

        expect(await new Iter(createAsyncIter()).toArray())
            .toEqual([1, 2, 3]);

        expect(await new Iter([1, 2, 3]).collect(new Set([0])))
            .toEqual(new Set([0, 1, 2, 3]));

        expect(await new Iter(createAsyncIter()).collect(new Set([0])))
            .toEqual(new Set([0, 1, 2, 3]));
    })

    test('map modifier', async () => {
        expect([...(new Iter<number>([1, 2, 3]).map(el => el ** 2))])
            .toEqual([1, 4, 9]);

        const
            res = [],
            it = new Iter<number>(createAsyncIter()).map(el => el ** 2);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([1, 4, 9]);
    })

    test('filter modifier', async () => {
        expect([...(new Iter<number>([1, 2, 3, 4, 5]).filter(el => el % 2 === 0))])
            .toEqual([2, 4]);

        const
            res = [],
            it = new Iter<number>(createAsyncIter(5)).filter(el => el % 2 === 0);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([2, 4]);
    })

    test('flatten modifier', async () => {
        expect([...(new Iter([1, [2, 3], [4, [5]]]).flatten(1))])
            .toEqual([1, 2, 3, 4, [5]]);

        expect([...(new Iter([1, [2, 3], [4, [5]]]).flatten(2))])
            .toEqual([1, 2, 3, 4, 5]);


        let
            res = [],
            it = new Iter<number>(createDeepAsyncIter()).flatten(1);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([[1], [2], [3]]);

        res = []
        it = new Iter<number>(createDeepAsyncIter()).flatten(2);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([1, 2, 3]);
    })

    test('flatMap modifier', async () => {
        expect([...(new Iter([1, [2, 3], [4, [5]]]).flatMap((el: number) => el + 1))])
            .toEqual([2, 3, 4, 5, 6]);


        let
            res = [],
            it = new Iter<number>(createDeepAsyncIter()).flatMap((el: number) => el + 1);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([2, 3, 4]);

    })

    test('take method', async () => {
        expect([...(new Iter([1, 2, 3, 4, 5]).take(3))])
            .toEqual([1, 2, 3]);

        const
            res = [],
            it = new Iter(createAsyncIter(5)).take(3);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([1, 2, 3])
    })

    test('inRange method', async () => {
        expect([...(new Iter([1, 2, 3, 4, 5]).inRange(1, 3))])
            .toEqual([2, 3, 4]);

        const
            res = [],
            it = new Iter(createAsyncIter(5)).inRange(2);

        for await (const el of it) {
            res.push(el)
        }

        expect(res).toEqual([3, 4, 5])
    })

    test('forEach method', async () => {
        const resSync = [];
        new Iter([1,2,3]).forEach(el => resSync.push(el + 1));
        expect(resSync).toEqual([2,3,4]);

        const resAsync = [];
        await new Iter<number>(createAsyncIter(3)).forEach(el => resAsync.push(el + 1));
        expect(resAsync).toEqual([2,3,4]);
    })

});