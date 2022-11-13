import * as aggregators from './index';

let iter;
let asyncIter;
let iterObj;

describe("Aggregators for iterators", () => {

    beforeEach(() => {
        iter = [1, 2, 3].values();
        iterObj = [{value: 1}, {value: 2}, {value: 3}].values();

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
                            value: {value: i * 10}
                        }))
                }
            }
        })();
    });

    it('should calculate sum of collection with numbers or with objects + value getter functions', async () => {
        expect(await aggregators.sum(iter)).toBe(6);

        expect(await aggregators.sum(iterObj, (el: any) => el.value)).toBe(6);

        expect(await aggregators.sum(asyncIter, (el: any) => el.value)).toBe(60);
    });

    it('should calculate average value of collection', async () => {
        expect(await aggregators.avg(iter)).toBe(2);

        expect(await aggregators.avg(iterObj, (el: any) => el.value)).toBe(2);

        expect(await aggregators.avg(asyncIter, (el: any) => el.value)).toBe(20);
    });

    it('should calculate max value of collection', async () => {
        expect(await aggregators.max(iter)).toBe(3);

        expect(await aggregators.max(iterObj, (el: any) => el.value)).toBe(3);

        expect(await aggregators.max(asyncIter, (el: any) => el.value)).toBe(30);
    });

    it('should calculate min value of collection', async () => {
        expect(await aggregators.min(iter)).toBe(1);

        expect(await aggregators.min(iterObj, (el: any) => el.value)).toBe(1);

        expect(await aggregators.min(asyncIter, (el: any) => el.value)).toBe(10);
    });

});