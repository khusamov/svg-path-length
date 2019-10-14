#!/usr/bin/env node

require('source-map-support').install();
const Path = require('path');
const SvgPathLengthService = require('../dist').default;

const packageJson = require(Path.join(__dirname, '../package.json'));
console.log(packageJson.description);
console.log('Версия:', packageJson.version);

(async function() {
	const service = new SvgPathLengthService(packageJson);
	await service.listen();
	console.log('Сервис доступен по адресу:', `http://localhost:${service.port}`)
})();