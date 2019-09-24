import Router from 'koa-router';
import koaBody from 'koa-body';
import calculateLength from './calculateLength';

export default class MainRouter {
	/**
	 * Основной маршрутизатор.
	 * @param packageJson
	 */
	static createRouter(packageJson) {
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
				const result = await calculateLength(svgFilePath);
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
}