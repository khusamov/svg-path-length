TODO
====

Сделать для сервера возможность конфигурировать.
Конфиг можно распарсить при помощи `eval(typescript.transpile())`.
https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API

Теоретически конфиги можно хранить в репозитории NPM, инсталировать глобально и подгружать
в скрипте через https://github.com/sindresorhus/import-global  
Разбор этого вопроса см. https://toster.ru/q/672430

```typescript
const materialTable = [{
    name: 'Фанера',
    code: 'plywood',
    price: {
        3: [{length: {min: 0, max: 100}, price: 24}, {length: {min: 100, max: 500}, price: 16}],
        4: [{length: {min: 0, max: 100}, price: 29}, {length: {min: 100, max: 500}, price: 19}]
    },
    calculatePrice: null
}];

// Длина линии, толщина материала, материал.
export function calculatePrice(length, thickness, material) {
   const price = materialTable.find(mater => mater.name === material);
   const item = price[thickness].find(item => item.length.min > length && item.length.max < length);
   if (!item) throw new Error(`Не найдена цена для ${length}, ${thickness}, ${material}.`);
   return item.price * (length / 100);
}
export function getMaterialTable() {
    return materialTable;
}
```

На сервере сделать АПИ:
- версия сервера
- расчет цены реза calculatePrice
- справочник материалов (Наименование, код, массив толщин)
- прием заказа

На клиенте сделать UI формы калькулятора:
Материал
Толщина материала
Ввод файла
Превью файла
Кнопку добавить
Смету
Кнопку Заказать

Сделать возможность вставки svg-path-length-client на любую HTML-страницу.
    1) Как папку с файлами и прописывание на странице.
    2) Как HTML+CSS+JS (например для установки на Тильде).
    3) Как CDN со своего сервера.

Сделать вывод версии сервера на svg-path-length-client.

Сделать развертывание для пакета packages/svg-path-length-service:
    Сборка, публикация и запуск команды npx на удаленном сервере по SSH.

Добавить пакеты:
- электрон приложение (для тестирования библиотеки и для настольного калькулятора) https://www.electronforge.io/
- сайт лендинг пэйдж (рекламный сайт)

Расчет эллипсов, сегментов, секторов, дуг и окружностей
---------------------------------------------

Добавить возможность расчета длины окружностей и эллипсов 
при помощи опции `convertArcs`:

```javascript
const svgo = new Svgo({
	plugins: [{
		convertShapeToPath: {
			convertArcs: true
		}
	}]
});
```

На текущий момент, добавление опции `convertArcs` приводит программу 
в нестабильное состояние (ошибка 'Неправильные данные path').

Созданы две заявки по данной проблеме:  
https://github.com/jkroso/parse-svg-path/issues/4  
https://github.com/rveciana/svg-path-properties/issues/25  

Требуется временно сделать вычисление длины окружностей и эллипсов отдельно 
от path (пока заявки не обработают или не будет найден другой вариант расчета).



Расчеты трансформированных элементов
------------------------------------

Требуется проверить расчет: 
сгруппированных, повернутых, масштабированных, наклоненных элементов.

Расчеты замкнутых и незамкнутых контуров
----------------------------------------


