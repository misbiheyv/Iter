import * as helpers from '.';
import { forEach } from "../iterators/modifiers";

describe('helpers', () => {
    test('createReverseIterator', async () => {
        const res = []
        await forEach(helpers.createReverseIterator([1,2,3]), el => res.push(el))
        expect(res).toEqual([3,2,1])
    })
})