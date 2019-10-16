Инструкции для разработчика
===========================

Мануал по SVG
http://xiper.net/learn/svg/svg-essentials/coordinates

Публикация пакетов
------------------

https://github.com/lerna/lerna/tree/master/commands/publish#readme

```
lerna publish
```

Запуск разработки клиента
-------------------------

Стандартный проект, созданный при помощи 
`yarn create react-app --typescript`.

```
cd packages/svg-path-length-client && yarn start
```

Запуск разработки веб-сервиса
-----------------------------

Состоит из 
- запуска непрерывной компиляции.
- запуска откомпилированной версии при помощи nodemon.

```
cd packages/svg-path-length-service && yarn tsc:watch
cd packages/svg-path-length-service && yarn start
```

Запуск разработки библиотеки
----------------------------

Библиотека представляет из себя обычный пакет, собираемый из TS-исходников 
при помощи компилятора `tsc`.

На данный момент процесс разработки библиотеки никак не организован.
Достаточно откомпилировать и опубликовать или использовать в других пакетах (соединенных lerna).

```
cd packages/svg-path-length-library
```