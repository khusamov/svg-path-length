import {Context} from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import calculateLength from './calculateLength';
import {ISvgPathLengthServiceKoaState} from './SvgPathLengthService';
import HttpCodeBadRequestError from './httpCode/HttpCodeBadRequestError';

/**
 * Основной маршрутизатор.
 */
export default class MainRouter {
	private static _mainRouterInstance: Router;

	static get middleware() {
		if (!this._mainRouterInstance) this._mainRouterInstance = this.createRouter();
		return this._mainRouterInstance.routes();
	}

	private static createRouter(): Router {
		const router = new Router<ISvgPathLengthServiceKoaState, ISvgPathLengthServiceKoaState>();
		router.get('/', this.rootController);
		router.post('/length', koaBody({multipart: true}), this.lengthController);
		router.get('/length', this.createGetStubController());
		return router;
	}

	/**
	 * Главная страница.
	 */
	private static rootController = async (ctx: Context) => {
		ctx.response.type = 'text/html; charset=utf-8';
		ctx.body = `
			<div>${ctx.state.packageJson.description}</div>
			<div>Версия: ${ctx.state.packageJson.version}</div>
		`;
	};

	/**
	 * Метод для расчета длины.
	 */
	private static lengthController = async (ctx: Context) => {
		if (!(ctx.request.files && ctx.request.files['svg-file-content'])) {
			throw new HttpCodeBadRequestError('Ожидается параметр svg-file-content');
		}
		const svgFilePath = ctx.request.files['svg-file-content'].path;
		const result = await calculateLength(svgFilePath);
		ctx.body = {result};
	};

	/**
	 * Создать заглушку для get-запроса.
	 */
	private static createGetStubController() {
		return (
			async (ctx: Context) => {
				ctx.response.type = 'text/html; charset=utf-8';
				ctx.body = '<div>Используйте POST-запрос.</div>';
			}
		)
	};
}