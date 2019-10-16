import {transpile} from 'typescript';
import {promisify} from 'util';
import {readFile, writeFile, watch, FSWatcher} from 'fs';
import {join} from 'path';
import {tmpdir} from 'os';
import IConfigExports from '../interfaces/IConfigExports';
import {TCalculatePriceFunction, TGetMaterialTableFunction} from '..';

export default class Config implements IConfigExports {
	// private static evalConfigFile(configFile: string, fileName?: string): IConfigExports {
	// 	let exports = {};
	// 	eval(transpile(configFile, {inlineSourceMap: true}, fileName));
	// 	return exports as IConfigExports;
	// }

	/**
	 * Компиляция файла, сохранение во временном файле и импортирование.
	 * История разбора данного вопроса https://toster.ru/q/675566
	 * Вместо eval можно было бы использовать vm.runInContext().
	 * https://nodejs.org/dist/latest-v12.x/docs/api/vm.html#vm_vm_runincontext_code_contextifiedsandbox_options
	 * @param configFile
	 * @param fileName
	 */
	private static async transpileAndImportConfigFile(configFile: string, fileName?: string): Promise<IConfigExports> {
		const configFileJavaScriptCode = transpile(configFile, {inlineSourceMap: true}, fileName);
		const configFileJavaScriptCodeFilePath = join(tmpdir(), Math.random() + '.js');
		await promisify(writeFile)(configFileJavaScriptCodeFilePath, configFileJavaScriptCode);
		return import(configFileJavaScriptCodeFilePath);
	}

	private static async readConfigFile(configFilePath: string): Promise<string> {
		return await promisify(readFile)(configFilePath, 'utf-8');
	}

	private watch() {
		if (!this.watcher) {
			this.watcher = watch(this.filePath, this.onWatchChange);
		}
	}

	private onWatchChange = async () => {
		this.unwatch();
		await this.load();
		console.log('Повторно загружен конфиг:', this.filePath);
	};

	private unwatch() {
		if (this.watcher) {
			this.watcher.close();
			this.watcher = undefined;
		}
	}

	private watcher: FSWatcher | undefined;

	filePath: string = join(process.cwd(), 'config.example.ts');
	calculatePrice: TCalculatePriceFunction = () => ({value: 0, unit: ''});
	getMaterialTable: TGetMaterialTableFunction = () => [];

	load = async () => {
		const configFile = await Config.readConfigFile(this.filePath);
		// const configFileExports = Config.evalConfigFile(configFile, this.filePath);
		const configFileExports = await Config.transpileAndImportConfigFile(configFile, this.filePath);
		this.calculatePrice = configFileExports.calculatePrice;
		this.getMaterialTable = configFileExports.getMaterialTable;
		this.watch();
	};
}