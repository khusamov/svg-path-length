#!/usr/bin/env node

const readPackageJson = require('read-pkg');
const SvgPathLengthService = require('../dist').default;

(async () => {
	const packageJson = await readPackageJson();
	console.log(packageJson.name);
	console.log(packageJson.description);
	console.log(packageJson.version);
	new SvgPathLengthService(packageJson).listen();
})();