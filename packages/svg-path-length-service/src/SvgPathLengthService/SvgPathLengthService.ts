import Koa, {Context} from 'koa';
import logger from 'koa-logger';
import cors from '@koa/cors';
import MainRouter from './MainRouter';
import HttpCodeError from './httpCode/HttpCodeError';

export interface ISvgPathLengthServiceKoaState {
	packageJson: {
		name: string;
		description: string;
		version: string;
	};
}

export default class SvgPathLengthService {
	app: Koa;
	port = 3000;

	constructor(packageJson) {
		const app = this.app = new Koa<ISvgPathLengthServiceKoaState>();

		// Передача состояния всего приложения.
		app.use(async (ctx, next) => {
			ctx.state.packageJson = packageJson;
			await next();
		});

		app.use(this.errorController);
		app.use(cors());
		app.use(logger());
		app.use(MainRouter.middleware);
	}

	async listen() {
		return new Promise(resolve => this.app.listen(this.port, () => resolve()));
	}

	/**
	 * Обработка ошибок.
	 * @param ctx
	 * @param next
	 */
	private errorController = async (ctx: Context, next) => {
		try {
			await next();
		} catch (error) {
			console.log(error);
			const status = error instanceof HttpCodeError ? error.statusCode : 500;
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
	};
}

