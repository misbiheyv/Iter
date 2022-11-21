Функции модификаторы для работы с iterable объектами:

Все функции этого модуля, кроме 'random' работают асинхронно ради большего полиморфизма с асинхронными итераторами.

- map(iterable, cb) - возвращает промис с итератором, применяющим переденный коллбэк к каждому элементу.
- filter(iterable, predicate) - возвращает промис с итератором, фильтрующим коллекцию с помощью переданного предиката.
- flatten(iterable, depth) - возвращает промис с итератором, раскрывающим вложенности на переданное число уровней.
- flatMap(iterable, cb) - возвращает промис с итератором, раскрывающим вложенные коллекции, применяя переданный коллбэк к каждому элементу.
- enumerate(iterable) - возвращает промис с итератором из пар индекса и значения.
- take(iterable, N) - возвращает промис с итератором включающим первые N элементы коллекции.
- inRange(iterable, startIndex, endIndex?) - возвращает промис с итератором, в диапазоне от startIndex по endIndex.
- cycle(iterable) - возвращает промис с бесконечным итератором с зацикленными значениями коллекции.
- random(min, max) - возвращает бесконечный итератор с рандомным числом в диапазоне от min до max на каждой итерации.
- forEach(iterable, cb) - итерируется по коллекции, применяя коллбэк на каждый элемент, возвращает промис после завершения обхода.
- chukedForEach(iterable, cb) - не блокирующий forEach (обходит данные по чанкам).

Пример использования

```js
map([1,2,3], el => el ** 2).then(console.log); // asyncIterator(1, 4, 9)

filter([1,2,3,4,5], el => el % 2 === 0).then(console.log); // asyncIterator(2,4)

flatten([1,[2,[3]]], 1).then(console.log); // asyncIterator([1,2,[3]])

flatMap([1,[2,[3]]], el => el ** 2).then(console.log); // asyncIterator(1, 4, 9)

enumerate(['a','b','c']).then(console.log); // asyncIterator('a', 'b', 'c')

take([1,2,3,4,5], 3).then(console.log); // asyncIterator(1, 2, 3)

inRange([1,2,3,4,5], 1, 3).then(console.log); // asyncIterator(2, 3, 4)

cycle([1,2,3]).then(console.log); // asyncIterator(1, 2, 3, 1, 2, 3, ...)

random(-3, 3).next() // -3 <= N <= 3

forEach([1,2,3], el => el ** 2).then(console.log); // последовательно выведет 1, 2 ,3

chunkedForEach(new Array(50e7), (_ ,i) => console.log(i)).then(console.log); // обработает все элементы массива не блокируя поток, по завершению отработает then

```
