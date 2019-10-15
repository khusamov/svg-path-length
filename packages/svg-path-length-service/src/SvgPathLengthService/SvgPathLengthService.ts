import Koa, {Context} from 'koa';
import logger from 'koa-logger';
import cors from '@koa/cors';
import MainRouter from './MainRouter';
import HttpCodeError from './httpCode/HttpCodeError';
import Config from './Config';

type TNextFunction = () => Promise<any>;

interface IPackageJsonFile {
	name: string;
	description: string;
	version: string;
}

export interface ISvgPathLengthServiceKoaState {
	service: SvgPathLengthService;
	packageJson: IPackageJsonFile;
}

export default class SvgPathLengthService {
	app: Koa | undefined;
	port = 3000;
	config = new Config;

	constructor(private packageJson: IPackageJsonFile) {}

	async listen() {
		await this.config.load();
		console.log('Загружен конфиг:', this.config.filePath);

		return (
			new Promise(resolve => {
				if (!this.app) this.app = this.createKoaApplication();
				return this.app.listen(this.port, () => resolve())
			})
		);
	}

	private createKoaApplication(): Koa {
		const app = new Koa<ISvgPathLengthServiceKoaState>();

		// Передача состояния всего приложения.
		app.use(async (ctx, next) => {
			ctx.state.packageJson = this.packageJson;
			ctx.state.service = this;
			await next();
		});

		app.use(this.errorController);
		app.use(cors());
		app.use(logger());
		app.use(MainRouter.middleware);

		return app;
	}

	/**
	 * Обработка ошибок.
	 * @param ctx
	 * @param next
	 */
	private errorController = async (ctx: Context, next: TNextFunction) => {
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

