import Iter from "./Iter/iter";

export default function intoIter<T>(iter: Iterable<T> | AsyncIterable<T>) {
     return new Iter(iter)
}