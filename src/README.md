# intoIter

### Создает новый Iter на основе переданных данных, имеет несколько перегрузок.

1. При передачи boolean значения создает бесконечный итератор
```js
import { intoIter } from './index.ts';

intoIter(true);   // Iter(0 ... Infinity)

intoIter(false);   // Iter(0 до -Infinity)
```

2. При передачи null или undefined создает пустой итератор
```js
import { intoIter } from './index.ts';

intoIter(null);   // Iter([])
```

3. При передачи целочисленного значения создает итератор в диапазоне от n до m.
  ```js
import { intoIter } from './index.ts';

intoIter(0, 3);  // Iter(0, 1, 2)

intoIter(-3, 0);  // Iter(0, -1, -2)
```

4. При передачи строк строк создает итератор в unicode диапазоне от кода первой переданной строки до кода второй переданной строки.
```js
import { intoIter } from './index.ts';

intoIter('a', 'c') // Iter('a', 'b', 'c')
```

5. При передачи iterable объекта создает итератор на его основе.
```js
import { intoIter } from './index.ts';

intoIter([1, 3]); // Iter(1, 2, 3)
```

6. При передачи асинхронного iterable объекта создает асинхронный итератор на его основе.
```js
import { intoIter } from './index.ts';

intoIter(asyncIter(1, 3)); // Iter(1, 2, 3)
```

7. При передачи обычного объекта, без итератора возвращает его values()

```js
import { intoIter } from './index.ts';

intoIter({a: 1, b: 2}); // Iter(1, 2)
```
