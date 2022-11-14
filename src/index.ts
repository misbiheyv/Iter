export function* mapSeq(iterable, handlers) {
    for (const el of iterable) {
        yield handlers.reduce((acc, cur) => cur(acc), el);
    }
}

const iter = mapSeq([1,2,3].values(), [el => el ** 2, el => el + 1, el => `${el}`])

for (const el of iter) {
    console.log(el)
}




// import Iter from "./Iter";
// import { chunkedForEach } from "./Iter/modifiers";
// import * as modifiers from "./Iter/modifiers";
// const createAsyncIter = (count = 3) => {
//     let i = 0;
//
//     return {
//         [Symbol.asyncIterator]() {
//             return this;
//         },
//         next: () => {
//             return new Promise(res => setTimeout(() => res(++i), 50))
//                 .then(res => ({
//                     done: i > count,
//                     value: i
//                 }))
//         }
//     }
// };
//
// // const sres = [];
// //
// // chunkedForEach(createAsyncIter(1e5), (_, i, iter) => console.log(i, iter))
// //     .then(res => console.log('END', res));
//
// let res = [];
//
// chunkedForEach(new Array(1e6).values(), (el: number) => {
//     res.push(el + 1)
// });
//
// setTimeout(() => console.log(res.length), 1000)
//
// // new Iter<number>([1,2,3]).map(el => el + 2).filter(el => el % 3 === 1).take(2)
