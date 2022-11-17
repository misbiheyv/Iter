import * as modifiers from './index';
import { sleep } from '../../helpers';

describe('Modifiers for iterables', () => {
    test('forEach. Should iterates values with passed function executing.', async () => {
        const res = []
        await modifiers.forEach([1,2,3], (el) => res.push(el))
        expect(res).toEqual([1,2,3])
    });

    test('map. Should maps the values with passed function.', async () => {
        const res = []
        await modifiers.forEach(modifiers.map([1,2,3], el => el ** 2), el => res.push(el))
        expect(res).toEqual([1,4,9])
    });

    test('filter. Should filters the elements with the predicate and yields values passed filter.', async () => {
        const res = []
        await modifiers.forEach(modifiers.filter([1,2,3], el => el % 2 === 0), el => res.push(el))
        expect(res).toEqual([2])
    });

    test('flatten. Should flattens nested iterables to passed level.', async () => {
        const res = []
        await modifiers.forEach(modifiers.flatten([[[1]],[2],3], 1), el => res.push(el))
        expect(res).toEqual([[1], 2, 3])
    });

    test('flatMap. Should maps each element of iterator, and yields the elements of the flatten iterator.', async () => {
        const res = []
        //TODO Сделать нормальную типизацию
        await modifiers.forEach(modifiers.flatMap([[[1]],[2],3], (el: number) => el ** 2), el => res.push(el))
        expect(res).toEqual([1, 4, 9])
    });

    test('take. Should take first N elements and stop iterator.', async () => {
        const res = []
        await modifiers.forEach(modifiers.take([1,2,3,4,5], 3), el => res.push(el))
        expect(res).toEqual([1, 2, 3])
    });

    test('cycle. Should repeats iterator endlessly.', async () => {
        const res = []
        await modifiers.forEach(
            modifiers.take(modifiers.cycle([1,2,3]), 7),
            el => res.push(el)
        )
        expect(res).toEqual([1, 2, 3, 1, 2, 3, 1])
    });


    test('enumerate. Should yields tuple of current index and element.', async () => {
        const res = []
        await modifiers.forEach(
            modifiers.enumerate([1,2,3]),
            el => res.push(el)
        )
        expect(res).toEqual([[0,1], [1,2], [2,3]])
    });

    test('inRange. Should iterates from the passed index N to index M.', async () => {

        let res = []
        await modifiers.forEach(
            modifiers.inRange([1, 2, 3, 4, 5], 1, 3),
            el => res.push(el)
        )
        expect(res).toEqual([2,3,4])

        res = []
        await modifiers.forEach(
            modifiers.inRange([1, 2, 3, 4, 5], 2 ),
            el => res.push(el)
        )
        expect(res).toEqual([3,4,5])
    });

    test('chunkedForEach. Should work like a regular forEach, but should not block the flow.', async () => {
        let i = 0;
        modifiers.chunkedForEach(
            new Array(50e6),
            () => i++
        )

        await sleep(100);
        expect(i).toBeGreaterThan(0);
    });
})