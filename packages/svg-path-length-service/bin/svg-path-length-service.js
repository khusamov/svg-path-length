#!/usr/bin/env node
const {join} = require('path');

require('../dist').serviceStart({
	packageRootPath: join(__dirname, '..')
});