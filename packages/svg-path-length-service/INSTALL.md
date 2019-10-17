Установка production
====================

Запуск через `PM2`
------------------

Сайт пакета PM2: http://pm2.keymetrics.io/

### Ручной вариант, через командную строку

```bash
pm2 start npx --name svg-path-length-service -- svg-path-length-service
```

Здесь `--name` имя процесса для списка процессов PM2, 
а опция `--` передает аргументы в процесс `npx`.

### Через файл `ecosystem.config.js` 

Для запуска сайта при помощи `pm2` следует создать файл `ecosystem.config.js` 
со следующим содержимым:

```javascript
module.exports = {
    apps : [{
        name: "svg-path-length-service",
        script: "/usr/bin/npx",
        args: "svg-path-length-service"
    }]
}
```




Установка NodeJS и NPM на Ubuntu или Debian
-------------------------------------------

Для работы веб-сервиса на сервере следует установить: NodeJS, NPM, npx.

```bash
# Using Ubuntu
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get install -y nodejs
```

Подробности см. на 
https://github.com/nodesource/distributions/blob/master/README.md#debinstall