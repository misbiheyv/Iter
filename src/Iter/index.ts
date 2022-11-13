import Iter from "./Iter/Iter";

export default function intoIter<T>(iter: Iterable<T> | AsyncIterable<T>) {
     return new Iter(iter)
}