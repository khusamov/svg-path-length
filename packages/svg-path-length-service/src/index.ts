import Koa from 'koa';
import Router from 'koa-router';
import readPackageJson from 'read-pkg';
import koaBody from 'koa-body';
import logger from 'koa-logger';
import {promisify} from 'util';
import {readFile} from 'fs';
import {join} from "path";
import {SvgContainer, SvgLengthCalculator, SvgCalculationReport} from 'svg-path-length-library';
import {PathLengthPlugin, CircleLengthPlugin, EllipseLengthPlugin} from 'svg-path-length-library';

(async () => {
	const packageJson = await readPackageJson();
	console.log(packageJson.name);
	console.log(packageJson.description);
	console.log(packageJson.version);

	const app = new Koa;

	// Обработка ошибок.
	app.use(async (ctx, next) => {
		try {
			await next();
		} catch (error) {
			console.log(error);
			const status = error.status || 500;
			ctx.status = status;
			ctx.body = {
				status: status,
				name: error.name,
				message: error.message,
				stack: error.stack.split('\n'),
				fileName: error.fileName,
				columnNumber: error.columnNumber,
				lineNumber: error.lineNumber
			};
		}
	});

	app.use(logger());

	const router = createRouter(packageJson);
	app.use(router.routes());

	app.listen(3000);
})();

/**
 * Основной маршрутизатор.
 * @param packageJson
 */
function createRouter(packageJson) {
	const router = new Router();

	/**
	 * Главная страница.
	 */
	router.get('/', async ctx => {
		ctx.body = `
			${packageJson.name}
			<br/>Описание: ${packageJson.description}
			<br/>Версия: ${packageJson.version}
		`;
	});

	/**
	 * Метод для расчета длины.
	 */
	router.post('/length', koaBody({multipart: true}), async ctx => {
		if (ctx.request.files && ctx.request.files['svg-file-content']) {
			const svgFilePath = ctx.request.files['svg-file-content'].path;
			const result = await calculate(svgFilePath);
			ctx.body = {
				success: true,
				result
			};
		} else {
			ctx.body = {
				success: false,
				message: 'Ожидается параметр svg-file-content.'
			};
		}
	});

	return router;
}

async function calculate(filepath) {
	const svgContainer = await SvgContainer.createFromFile(filepath);
	const svgLengthCalculator = (
		new SvgLengthCalculator(svgContainer, {
			isCalculateCirclesSeparately: true
		})
	);
	return (
		await svgLengthCalculator.calculateLength([
			new PathLengthPlugin,
			new CircleLengthPlugin,
			new EllipseLengthPlugin
		])
	);
}