import Iter from "./Iter/Iter/iter";

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

const iter = new Iter(createAsyncIter(5)).take(3);

//
// (async () => {
//     const
//         res = [],
//         it = new Iter(createAsyncIter(5)).take(3);
// })()