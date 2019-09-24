#!/usr/bin/env node

const Path = require('path');
const SvgPathLengthService = require('../dist').default;

const packageJson = require(Path.join(__dirname, '../package.json'));
console.log(packageJson.name);
console.log(packageJson.description);
console.log(packageJson.version);

new SvgPathLengthService(packageJson).listen();