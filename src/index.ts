import Iter from "./Iter";
import { zip } from "./Iter/combinators";


(async () => {
    for await (const el of zip(new Set(['a', 'b', 'c']), [1,2,3])) console.log(el);

    for await (const el of Iter.zip(['a', 'b', 'c'], [1,2,3])) console.log(el);

    for await (const el of new Iter([1,2,3]).zip(['a', 'b', 'c'])) console.log(el);
})()