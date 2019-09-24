# `svg-path-length-service`

Микросервис для расчета длины линий в SVG-файлах.

## Usage

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