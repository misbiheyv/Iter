import Iter from "./Iter";
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

console.log(new Iter(createAsyncIter(3)));
//
//
//
// const obj = {
//     reverse(): IterableIterator<unknown> {
//         let i = 3;
//         return {
//             [Symbol.iterator]() {
//                 return this
//             },
//             next() {
//                 return {
//                     done: i-- === 0,
//                     value: [1, 2, 3][i]
//                 }
//             }
//         }
//     },
//     [Symbol.iterator]() {
//         let i = 0;
//         return {
//             [Symbol.iterator]() {
//                 return this
//             },
//             next() {
//                 return {
//                     done: i >= [1,2,3].length,
//                     value: [1,2,3][i++]
//                 }
//             }
//         }
//     }
// }
//
//
// console.log([...new Iter([1,2,3,4]).reverse()])
//
// // console.log([...])
//
// // const obj = {
// //     *reverse() {
// //         for (let i = this.items.length - 1; i >= 0; i--) {
// //             yield this.items[i]
// //         }
// //     },
// //     items: [1,2,3]
// // }
// //
// // for (const el of obj.reverse()) {
// //     console.log(el)
// // }
//
// // import { chunkedForEach } from "./Iter/modifiers";
// // import * as modifiers from "./Iter/modifiers";
// // const createAsyncIter = (count = 3) => {
// //     let i = 0;
// //
// //     return {
// //         [Symbol.asyncIterator]() {
// //             return this;
// //         },
// //         next: () => {
// //             return new Promise(res => setTimeout(() => res(++i), 50))
// //                 .then(res => ({
// //                     done: i > count,
// //                     value: i
// //                 }))
// //         }
// //     }
// // };
// //
// // // const sres = [];
// // //
// // // chunkedForEach(createAsyncIter(1e5), (_, i, iter) => console.log(i, iter))
// // //     .then(res => console.log('END', res));
// //
// // let res = [];
// //
// // chunkedForEach(new Array(1e6).values(), (el: number) => {
// //     res.push(el + 1)
// // });
// //
// // setTimeout(() => console.log(res.length), 1000)
// //
// // // new Iter<number>([1,2,3]).map(el => el + 2).filter(el => el % 3 === 1).take(2)
