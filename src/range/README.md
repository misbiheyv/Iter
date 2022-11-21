Создает итератор в заданном диапазоне. Реализуется классом Range.\
Range позволяет создавать диапазоны чисел или символов, затем обходить элементы с любого конца.:


Пример использования

```js
import Range from './Range';

const symbolRange = new Range('a', 'f');
console.log(Array.from(symbolRange)); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = new Range(-5, 1);
console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]
```
