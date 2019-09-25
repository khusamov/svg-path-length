Развертывание проекта
=====================

Специальный скрипт для развертывания проекта на тестировочном и продуктовом серверах.

Для разработки скрипта потребовалась функция отправки директории (не списка файлов, 
а именно локальной директории со всем ее содержимым) на удаленный сервер по SSH/SFTP.
Эта функция была найдена пока только в пакете [node-ssh](node-ssh).

Найденные проблемы
------------------

Там была проблема с отправкой файлов, которая была решена установкой опции в значение 1.
Пока не ясно что это за опция (она используется в пакете [p-map](p-map)).

Перспективы
-----------

Есть еще два перспективных пакета для отправки файлов, но в них нет готовой функции 
для отправки директории на удаленный сервер. Это пакеты [ssh2-sftp-client](ssh2-sftp-client) 
и [ssh2-promise](ssh2-promise). Причем пакет [ssh2-promise](ssh2-promise) удобен тем, что
сочетает в себе оба клиента SSH (позволяет запускать команды на удаленном сервере
например `npx <пакет>`) и SFTP (позволяет отправлять и принимать файлы).

#### Также было найдено:

[Dokku](dokku) - утилита для создания своего docker-сервера (аналог Heroku). 
Но не годится из-за привязки к git push.

Ссылки по Dokku:    
http://dokku.viewdocs.io/dokku/deployment/application-deployment/  
https://habr.com/ru/company/likeastore/blog/211016/  
https://habr.com/ru/post/225513/  

[Shipit](shipit) - аналог Capistrano. Но там проблема с директориями 
и невозможностью запустить `npx`.

[Flightplan](flightplan) - утилита для развертывания, но больше напоминает SSH-клиент. 
Надо позже подробнее рассмотреть.

[PM2 deployment](pm2deployment) - PM2 тоже может заниматься развертыванием, но ограничен по функционалу.


Настройка развертывания
-----------------------

Для работы скрипта следует создать файл `deploy.config.ts` с таким 
содержимым (опции берутся из [node-ssh](node-ssh) `ssh.connect({...options})`):

```typescript
export const sshConfig = {
	host: '',
	username: 'root',
	password: ''
};

export const deployConfig = {
	'svg-path-length-client': {
		localDir: 'packages/svg-path-length-client/build',
		remoteDir: '/var/www/khusamov/data/www/svg-path-length.khusamov.ru'
	}
};
```

[node-ssh]: https://www.npmjs.com/package/node-ssh
[p-map]: https://www.npmjs.com/package/p-map

[ssh2-sftp-client]: https://www.npmjs.com/package/ssh2-sftp-client
[ssh2-promise]: https://www.npmjs.com/package/ssh2-promise

[flightplan]: https://github.com/pstadler/flightplan
[dokku]: https://github.com/dokku/dokku
[shipit]: https://github.com/shipitjs/shipit
[pm2deployment]: http://pm2.keymetrics.io/docs/usage/deployment/