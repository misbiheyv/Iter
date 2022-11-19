import Range from './range';

describe('Range', () => {
    it('should create iterator in numeric range', () => {
        expect([...new Range(0, 3).values()]).toEqual([0, 1, 2, 3]);

        expect([...new Range(-1, 1).values()]).toEqual([-1, 0, 1]);

        expect([...new Range(-4, -2).values()]).toEqual([-4, -3, -2]);
    })

    it('should create reversed iterator in numeric range', () => {
        expect([...new Range(0, 3).reverse()]).toEqual([3, 2, 1, 0]);

        expect([...new Range(-1, 1).reverse()]).toEqual([1, 0, -1]);

        expect([...new Range(-4, -2).reverse()]).toEqual([-2, -3, -4]);

        expect([...new Range(1, 1).values()]).toEqual([1]);
    })

    it('should create range of symbols', () => {
        expect([...new Range('a', 'c').values()]).toEqual(['a', 'b', 'c']);

        expect([...new Range('a', 'c').reverse()]).toEqual(['c', 'b', 'a']);

        expect([...new Range('a', 'a').values()]).toEqual(['a']);
    })

    it('should create infinity iterator', () => {
        const iter = new Range(0, Infinity).values()
        expect(iter.next().value).toBe(0)
        expect(iter.next().value).toBe(1)
        expect(iter.next().value).toBe(2)
    })

    it('should create negative infinity iterator', () => {
        const iter = new Range(0, -Infinity).values()
        expect(iter.next().value).toBe(0)
        expect(iter.next().value).toBe(-1)
        expect(iter.next().value).toBe(-2)
    })
})