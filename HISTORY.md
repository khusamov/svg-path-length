История изменений
=================

2019-09-24
----------

Исправлена ошибка 'Converting circular structure to JSON'.

Создан пакет `packages/svg-path-length-client` с первой версией клиента на ReactJS.

Опубликованы на NPM пакеты  
https://www.npmjs.com/package/svg-path-length-service  
https://www.npmjs.com/package/svg-path-length-library  

2019-09-23
----------

Проект переведен на управление при помощи Lerna.  
Добавлен пакет с микросервисом packages/svg-path-length-service.  
В пакете svg-path-length-service реализован тестовый метод length.  

2019-09-12
----------

Опция noSpaceAfterFlags выставлена в false. Таким образом была решена 
проблема 'malformed path data', которая возникала, если в документе присутствовали дуги.

Оказывается есть опция noSpaceAfterFlags у плагина [convertPathData](convertPathData).
Ее следовало выставить в false, чтобы появились пробелы после флагов команд. Это особенность синтаксиса
элемента svg:path. Библиотеки svg-path-properties и point-at-length, которые реализуют метод getTotalLength, 
не понимают такой синтаксис. 

Подробности см. https://github.com/svg/svgo/issues/1137#issuecomment-517738958

[convertPathData]: https://github.com/svg/svgo/blob/master/plugins/convertPathData.js

2019-09-10
----------

Добавлено вычисление эллипсов.
Метод взят со страницы:
https://stackoverflow.com/questions/39866153/calculate-apprx-svg-ellipse-length-calculate-apprx-ellipse-circumference-wit

Обнаружена проблема с дугами. Опять та же проблема. Описание проблемы с дугами добавлены в заявки:

https://github.com/jkroso/parse-svg-path/issues/4  
https://github.com/rveciana/svg-path-properties/issues/25

2019-09-09
----------

Обнаружено, что нельзя рассчитать сумму длин, если на чертеже имеется окружность.
Добавлена задача: Расчет эллипсов, сегментов, дуг и окружностей.

Сделано временное решение этой проблемы: вычисление окружностей
отдельно от path. Но еще надо сделать вычисление эллипсов и возможно
еще каких-то элементов.

2019-09-08
----------

Найдена библиотека https://www.npmjs.com/package/svgo
позволяющая сделать следующее:
- слить все трансформации к одной
- заменить все примитивы на path

Теоретически этого достаточно, чтобы подсчитать длину всех линий.

Действие библиотеки можно визуально оценить на следующем сайте:
https://jakearchibald.github.io/svgomg/

Изменен расчет суммы длин всех path при помощи `svgo`.

https://www.npmjs.com/package/svgo

2019-09-07
----------

Сделано чтение аттрибута из элементов SVG-файла при помощи xmldom и xpath.

Найден метод `SVGPathElement.getTotalLength()`. Теоретически с его помощью можно рассчитывать
длины всех элементов path, а возможно и других элементов.

Найдена и применена библиотека `point-at-length`, в которой реализован метод `getTotalLength()`.
Последнее обновление было 2 года назад.

Найдена и применена библиотека `svg-path-properties`, в которой реализован метод `getTotalLength()`. 
Ее отличие от `point-at-length` в том, что последние коммиты датируются 2019 годом.

Также найден полифил для браузеров `svg-path-polyfill`, но его нельзя использовать напрямую, 
поэтому оставлен на всякий случай, если найденные алгоритмы `getTotalLength()` не сработают.

Написан тестовый расчет длины линий line и path.

https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement/getTotalLength  
https://www.npmjs.com/package/point-at-length  
https://github.com/rveciana/svg-path-properties  
https://github.com/ThePedestrian/svg-path-polyfill  