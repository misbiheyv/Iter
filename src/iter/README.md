# Iter

## Класс реализует удобный API для работы с любыми iterable объектами, с возможностью выстраивать цепочки обрабочтиков.

- ### [Конструктор](#ctor)
- ### [Итераторы](#iters)
- ### [Статические методы](#static)
- ### [Аггрегаторы](#aggregators)
- ### [Модификаторы](#modifiers)
- ### [Комбинаторы](#combinators)
- ### [Коллекторы](#collectors)

### <a name="ctor">Конструктор</a>
```js
new Iter([1,2,3]) // создает новый Iter([1, 2, 3]) на основе переданной iterable коллекции
```

### <a name="iters">Итераторы</a>

- [Symbol.iterator]() - возвращает базовый синхронный итератор либо кидает ошибку
- [Symbol.asyncIterator]() - возвращает базовый асинхронный итератор либо кидает ошибку
- values() - возвращает базовый синхронный или асинхронный итератор
- reverseValues() - возвращает базовый развернутый синхронный или асинхронный итератор
- reverse() - возвращает новый Iter на основе reverseValue

### <a name="static">Статические методы</a>

- random(min, max)
```js
Iter.random(-3, 3) // Генератор целых чисел в промежутке [-3, 3]
```

- seq(...iterables)
```js
Iter.seq([1,2], [3,4], [5,6]) // Iter(1, 2, 3, 4, 5, 6)
```

- zip(...iterables)
```js
Iter.seq([1,2], ['a','b'], [true,false]) // Iter([1, 'a', true], [2, 'b', false])
```


### <a name="aggregators">[Методы аггрегаторы](https://github.com/misbiheyv/iter/tree/main/src/iterators/aggregators)</a>

- avg(fn?)
```js
new Iter([1,2,3]).avg() // 2
```

- sum(fn?)
```js
new Iter([1,2,3]).sum() // 6
```

- max(fn?)
```js
new Iter([1,2,3]).max() // 3
```

- min(fn?)
```js
new Iter([1,2,3]).min() // 1
```


### <a name="modifiers">[Методы модификаторы](https://github.com/misbiheyv/iter/tree/main/src/iterators/modifiers)</a>

- map(cb)
```js
new Iter([1,2,3]).map(el => el ** 2) // Iter([1, 4, 9])
```

- filter(predicate)
```js
new Iter([1,2,3]).filter(el => el % 2 === 0) // Iter([2])
```

- flatten(depth)
```js
new Iter([1,[2,[3]]]).flatten(1) // Iter([1, 2, [3]])
```

- flatMap(cb)
```js
new Iter([1,[2,[3]]]).flatMap(el => el ** 2) // Iter([1, 4, 9])
```

- enumerate()
```js
new Iter(['a', 'b']).enumerate() // Iter([[0, 'a'], [1, 'b']])
```

- take(N)
```js
new Iter([1,2,3,4,5]).take(3) // Iter([1, 2, 3])
```

- inRange(startIndex, endIndex?)
```js
new Iter([1,2,3,4,5]).inRange(1, 4) // Iter([2, 3, 4])
```

- cycle()
```js
new Iter([1,2]).cycle() // Iter([1, 2, 1, 2, ...])
```

- forEach(cb)
```js
new Iter([1,2,3]).map(el => el ** 2).forEach(console.log) // Выведет в консоль последовательно 1, 3, 9
```

- chukedForEach(cb)
```js
new Iter(new Array(50e7)).chunkedForEach(console.log) // обработает и выведет все значения в консоль по чанкам не блокируя поток
```


### <a name="combinators">[Методы комбинаторы](https://github.com/misbiheyv/iter/tree/main/src/iterators/combinators)</a>

- chain(...iterables)
```js
new Iter([1,2,3]).chain([4,5,6]) // Iter([1, 2, 3 ,4, 5, 6]);
```

- zip(...iterables)
```js
new Iter([1,2]).zip(['a','b']) // Iter([[1, 'a'], [2, 'b']]);
```

- mapSeq(...fuctions)
```js
new Iter([1, 2, 3]).mapSeq([el => el ** 2, el => el + 1]) // Iter([2, 5, 10]);
```


### <a name="collectors">[Методы коллекторы](https://github.com/misbiheyv/iter/tree/main/src/iterators/collectors)</a>

- toArray()
```js
new Iter([1, 2, 3]).toArray() // [1, 2, 3];
```

- collect(instance of collection)
```js
new Iter([1, 2, 3]).toArray(new Set([-1, 0])) // [-1, 0, 1, 2, 3];
```
