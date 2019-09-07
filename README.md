Утилита для вычисления длин всех линий в SVG-файле
==================================================

Эксперимент по чтению объектов из SVG-файла.

На данный момент сделано: 
- чтение аттрибута,
- вычисление длины path.

Исследование вопроса расчета длины линий
-----------------------------

Найден метод `SVGPathElement.getTotalLength()`.

https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement/getTotalLength

Метод позволяет расчитать длину элемента path. Найдены в NPM и Github 
библиотеки для NodeJS, 
реализующие этот метод:

Довольно свежая (2019 год) библиотека:
https://github.com/rveciana/svg-path-properties

Полифил для браузеров:
https://github.com/ThePedestrian/svg-path-polyfill

Довольно старая библиотека:
https://www.npmjs.com/package/point-at-length

Найдена библиотека https://www.npmjs.com/package/svgo
позволяющая сделать следующее:
- слить все трансформации к одной
- заменить все примитивы на path

Теоретически этого достаточно, чтобы подсчитать длину всех линий.