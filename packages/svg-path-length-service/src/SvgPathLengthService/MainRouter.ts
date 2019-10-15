import {Context} from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import calculateLength from './calculateLength';
import {ISvgPathLengthServiceKoaState} from './SvgPathLengthService';
import HttpCodeBadRequestError from './httpCode/HttpCodeBadRequestError';
import Config from './Config';
import {IMaterialTableItem} from '..';

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
		router.get('/length', this.createGetStubController);
		router.get('/materials', this.getMaterialTableController);
		router.post('/calculate-price', koaBody({multipart: true}), this.calculatePriceController);
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
	 * Получить таблицу с материалами.
	 * @param ctx
	 */
	private static getMaterialTableController = async (ctx: Context) => {
		ctx.body = ctx.state.service.config.getMaterialTable();
	};

	/**
	 * Расчитать цену реза.
	 * @param ctx
	 */
	private static calculatePriceController = async (ctx: Context) => {
		const config = ctx.state.service.config as Config;
		const materials = config.getMaterialTable();
		let {length: lengthText, thickness: thicknessText, material: materialCode} = ctx.request.body;
		let material: IMaterialTableItem | undefined;

		if (materialCode === undefined) throw new HttpCodeBadRequestError('Ожидается параметр material');
		material = materials.find(material => material.code === materialCode);
		if (!material) throw new HttpCodeBadRequestError(`Материал с кодом '${materialCode}' не найден`);

		const thickness = parseInt(thicknessText);
		if (thicknessText === undefined) throw new HttpCodeBadRequestError('Ожидается параметр thickness');
		if (isNaN(thickness)) throw new HttpCodeBadRequestError('Параметр thickness содержит не число');
		if (!material.price[thickness]) {
			throw new HttpCodeBadRequestError(`В таблице цен материала '${materialCode}' не найдена толщина материала ${thickness} мм'`);
		}

		const svgFileContent = (
			ctx.request.files && ctx.request.files['svg-file-content']
				? ctx.request.files['svg-file-content']
				: null
		);

		if (svgFileContent && lengthText !== undefined) {
			throw new HttpCodeBadRequestError('Параметры svg-file-content или length передавать вместе нельзя');
		}

		let length;
		if (lengthText === undefined) {
			if (!svgFileContent) {
				throw new HttpCodeBadRequestError('Ожидается параметр svg-file-content или length');
			}
			const svgFilePath = svgFileContent.path;
			const calculateLengthResult = await calculateLength(svgFilePath);
			const unit = calculateLengthResult.totalLength.unit;
			if (unit !== 'mm') throw new Error(`Единица измерения линий '${unit}', а ожидается mm`);
			length = calculateLengthResult.totalLength.value;
		} else {
			length = parseInt(lengthText);
		}
		if (isNaN(length)) throw new HttpCodeBadRequestError('Параметр length содержит не число');

		ctx.body = config.calculatePrice(length, thickness, materialCode);
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