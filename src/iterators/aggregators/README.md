# Функции аггрегаторы для работы с iterable объектами

### Все функции этого модуля работают асинхронно ради большего полиморфизма с асинхронными итераторами.
### Функции принимают итерируемую коллекцию и опциональный параметр функции-геттера для вложенных структур.

- await avg(iterable, fn?) - находит среднее арифметическое коллекции.
- await sum(iterable, fn?) - находит сумму коллекции.
- await max(iterable, fn?) - находит максимальное значение в коллекции.
- await min(iterable, fn?) - находит минимальное значение в коллекции.

Пример использования

```js
import { avg, sum, max, min } from './aggregators';

const 
  deepIterable = [{value: 1}, {value: 2}, {value: 3}],
  simpleIterable = [1, 2, 3];

avg(deepIterable, el => el.value).then(console.log); // 2

sum(simpleIterable).then(console.log); // 6

max(simpleIterable).then(console.log); // 3

min(deepIterable, el => el.value).then(console.log); // 1

```
