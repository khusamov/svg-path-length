`svg-path-length-service`
=========================

Микросервис для расчета длины линий в SVG-файлах.

Запуск через `pm2`
------------------

### Напрямую

```bash
pm2 start npx --name svg-path-length-service -- svg-path-length-service
```

### Через файл `ecosystem.config.js` 

Для запуска сайта при помощи `pm2` следует создать файл `ecosystem.config.js` 
со следующим содержимым:

```javascript
module.exports = {
  apps : [{
    name: "svg-path-length-service",
    script: "/usr/bin/npx",
    args: "--package svg-path-length-service"
  }]
}
```

Установка NodeJS и NPM на Ubuntu или Debian
-------------------------------------------

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