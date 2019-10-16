import {transpile} from 'typescript';
import {promisify} from 'util';
import {readFile, writeFile, watch, FSWatcher} from 'fs';
import {join} from 'path';
import {tmpdir} from 'os';
import {createContext, runInContext} from 'vm';
import IConfigExports from '../interfaces/IConfigExports';
import {TCalculatePriceFunction, TGetMaterialTableFunction} from '..';

export default class Config implements IConfigExports {
	/**
	 * Выполнение конфигурационного файла.
	 * История разбора данного вопроса https://toster.ru/q/675566
	 * Вместо eval можно было бы использовать vm.runInContext().
	 * https://nodejs.org/dist/latest-v12.x/docs/api/vm.html#vm_vm_runincontext_code_contextifiedsandbox_options
	 *
	 * Координаты ошибки подставляются НЕ правильные.
	 * На данный момент координаты ошибки направлены на JS-файл, а не на TS-исходник.
	 * https://github.com/evanw/node-source-map-support/issues/256
	 *
	 * @param configFileContent
	 * @param fileName
	 */
	private static evalConfigFile(configFileContent: string, fileName: string): IConfigExports {
		const configFileJavaScriptCode = transpile(configFileContent, {inlineSourceMap: true}, fileName);
		const sandbox = {exports: {}};
		runInContext(configFileJavaScriptCode, createContext(sandbox), {filename: fileName});
		return sandbox.exports as IConfigExports;
	}

	/**
	 * Компиляция и импортирование файла. Результат импортирования возвращается.
	 *
	 * На данный момент имя файла подставляется правильное (TS-файл), а вот путь к этому файлу
	 * подставляется неверно (путь к временному JS-файлу).
	 *
	 * Координаты ошибки подставляются правильные.
	 * @param configFileContent
	 * @param fileName
	 */
	private static async transpileAndImportConfigFile(configFileContent: string, fileName?: string): Promise<IConfigExports> {
		const configFileJavaScriptCode = transpile(configFileContent, {inlineSourceMap: true}, fileName);
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