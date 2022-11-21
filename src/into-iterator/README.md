# intoIterator

### Создает итератор на основе переданных данных, имеет несколько перегрузок.

1. При передачи boolean значения создает бесконечный итератор
```js
import { intoIterator } from './into-iterator';

intoIter(true);   // От 0 до Infinity

intoIter(false);   // от 0 до -Infinity
```

2. При передачи null или undefined создает пустой итератор
```js
import { intoIterator } from './into-iterator';

console.log([...intoIterator(null)]);   // []
```

3. При передачи целочисленного значения создает итератор в диапазоне от n до m.
  ```js
import { intoIterator } from './into-iterator';

console.log([...intoIterator(3)]);  // [0, 1, 2]

console.log([...intoIterator(-3)]);  // [0, -1, -2]
```

4. При передачи строк строк создает итератор в unicode диапазоне от кода первой переданной строки до кода второй переданной строки.
```js
import { intoIterator } from './into-iterator';

console.log([...intoIterator('a', 'c')]); // ['a', 'b', 'c']
```

5. При передачи iterable объекта создает итератор на его основе.
```js
import { intoIterator } from './into-iterator';

console.log([...intoIterator([1, 2])]);
```

6. При передачи асинхронного iterable объекта создает асинхронный итератор на его основе.
```js
import { intoIterator } from './into-iterator';

for await (const el of (async function* () { yield* [1, 2]; })()) {
  // 1
  // 2
  console.log(el);
}
```

7. При передачи обычного объекта, без итератора возвращает его values()

```js
import { intoIterator } from './into-iterator';

console.log([...intoIterator({a: 1, b: 2})]); // [1, 2]
```
