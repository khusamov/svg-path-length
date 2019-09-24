import Koa from 'koa';
import logger from 'koa-logger';
import cors from '@koa/cors';
import MainRouter from './MainRouter';

export default class SvgPathLengthService {
	app: Koa;

	constructor(packageJson) {
		const app = this.app = new Koa;

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

		app.use(cors());
		app.use(logger());

		const router = MainRouter.createRouter(packageJson);
		app.use(router.routes());
	}

	listen() {
		this.app.listen(3000);
	}
}

