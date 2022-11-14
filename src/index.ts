import Iter from "./Iter/Iter/iter";
import { forEach, asyncForEach } from "./Iter/modifiers";
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

const sres = [];
forEach([1,2,3].values(), el => sres.push(el));
console.log(sres)

const ares = [];
asyncForEach(createAsyncIter(3), el => ares.push(el)).then(() => console.log(ares));

// (async () => {
// // })()