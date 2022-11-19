import { intoIterator } from './into-iterator';

function* getGenerator(iter: Iterable<unknown>): IterableIterator<unknown> {
    yield* iter;
}

const getIterable = () => ({
    *[Symbol.iterator]() {
        for (const el of [1,2,3]) {
            yield el
        }
    }
})

const getAsyncIterable = () => ({
    async *[Symbol.asyncIterator]() {
        for await (const el of [1,2,3]) {
            yield el
        }
    }
})

describe('intoIter', () => {
    test('iterator from number', () => {
        expect([...intoIterator(3)]).toEqual([1, 2, 3])

        expect([...intoIterator(-3)]).toEqual([-1, -2, -3])

        expect([...intoIterator(0)]).toEqual([])
    });

    test('iterator from undefined/null', () => {
        expect([...intoIterator(undefined)]).toEqual([]);

        expect([...intoIterator(null)]).toEqual([]);
    });

    test('infinity iterator from boolean', () => {
        const positiveIter = intoIterator(true);
        expect(positiveIter.next().value).toEqual(0);
        expect(positiveIter.next().value).toEqual(1);
        expect(positiveIter.next().value).toEqual(2);

        const negativeIter = intoIterator(false);
        expect(negativeIter.next().value).toEqual(-1);
        expect(negativeIter.next().value).toEqual(-2);
        expect(negativeIter.next().value).toEqual(-3);
    });

    test('iterator from string', () => {
        expect([...intoIterator('hello')]).toEqual(['h', 'e', 'l', 'l', 'o']);

        expect([...intoIterator('12😀😀21')]).toEqual(['1', '2', '😀', '😀', '2', '1']);

        expect([...intoIterator('')]).toEqual([]);
    });

    test('iterator from array', () => {
        expect([...intoIterator([1, 2, 3])]).toEqual([1, 2, 3]);

        expect([...intoIterator([])]).toEqual([]);
    });

    test('iterator from different objects with iterator', async () => {
        expect([...intoIterator(getIterable())]).toEqual([1, 2, 3]);

        const res = [];

        for await (const el of intoIterator(getAsyncIterable())) {
            res.push(el);
        }

        expect(res).toEqual([1,2,3]);
    });

    test('iterator from object', () => {
        expect([...intoIterator({a: 1, b: 2})]).toEqual([1, 2]);
    })

    test('iterator from iterator', () => {
        expect([...intoIterator(intoIterator([1,2,3]))]).toEqual([1,2,3]);

        const iter = intoIterator([1,2,3])
        for (const el of iter) {
            break;
        }
        expect([...intoIterator(iter)]).toEqual([2,3]);
    })

    test('iterator from generator', () => {
        expect([...intoIterator(getGenerator([1,2,3]))]).toEqual([1,2,3]);

        const iter = intoIterator(getGenerator([1,2,3]));
        for (const el of iter) {
            break;
        }
        expect([...intoIterator(iter)]).toEqual([2,3]);
    })
})