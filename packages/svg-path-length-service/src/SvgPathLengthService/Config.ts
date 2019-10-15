import {transpile} from 'typescript';
import {promisify} from 'util';
import {readFile, writeFile, watch} from 'fs';
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
		if (!this.watchingEnabled) {
			watch(this.filePath, this.load);
			this.watchingEnabled = true;
		}
	}

	private watchingEnabled = false;
	private filePath: string = join(process.cwd(), 'config.example.ts');

	calculatePrice: TCalculatePriceFunction = () => 0;
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