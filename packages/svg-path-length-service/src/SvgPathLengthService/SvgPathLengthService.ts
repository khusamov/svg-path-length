import Koa, {Context} from 'koa';
import logger from 'koa-logger';
import cors from '@koa/cors';
import MainRouter from './MainRouter';
import HttpCodeError from './httpCode/HttpCodeError';
import Config from './Config';
import {join} from "path";

type TNextFunction = () => Promise<any>;

interface ISvgPathLengthServiceParams {
	packageJson: IPackageJsonFile

	/**
	 * Абсолютный путь к директории пакета, где находится файл package.json.
	 */
	packageRootPath: string;
}

export interface IPackageJsonFile {
	name: string;
	description: string;
	version: string;
}

export interface ISvgPathLengthServiceKoaState {
	service: SvgPathLengthService;
	packageJson: IPackageJsonFile;
}

export default class SvgPathLengthService {
	private readonly packageJson: IPackageJsonFile;
	private readonly packageRootPath: string;
	private app: Koa | undefined;
	private config: Config;
	port = 3000;

	constructor({packageJson, packageRootPath}: ISvgPathLengthServiceParams) {
		this.packageJson = packageJson;
		this.packageRootPath = packageRootPath;
		this.config = new Config(join(this.packageRootPath, 'config.example.ts'));
	}

	async listen() {
		await this.config.load();
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

