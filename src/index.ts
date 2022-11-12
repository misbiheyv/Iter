import Iter from "./Iter/Iter";

Array.prototype[Symbol.asyncIterator] = () => {
    let i = 0;

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next: () => {
            return new Promise(res => setTimeout(() => res(++i), 200))
                .then(res => ({
                    done: i > 2,
                    value: i + 10
                }))
        }
    }
};

const iter = new Iter([1, 2], 'async');

iter.collect(new Set()).then(console.log);