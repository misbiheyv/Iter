import Iter from "./Iter";
import * as helpers from './helpers'


(async () => {
    console.log(await new Iter([1,2,3]).reverse().toArray())
})()