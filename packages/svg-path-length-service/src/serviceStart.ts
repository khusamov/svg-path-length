import {install} from 'source-map-support';
import {join} from 'path';
import SvgPathLengthService, {IPackageJsonFile} from './SvgPathLengthService';

interface IServiceStartArgs {
	/**
	 * Абсолютный путь к директории пакета, где находится файл package.json.
	 */
	packageRootPath: string;
}

install();

/**
 * Специальный скрипт для запуска веб-сервиса.
 */
export async function serviceStart({packageRootPath}: IServiceStartArgs) {
	const packageJson: IPackageJsonFile = await import(join(packageRootPath, 'package.json'));
	console.log(packageJson.description);
	console.log('Версия:', packageJson.version);

	const service = new SvgPathLengthService({packageJson, packageRootPath});
	await service.listen();
	console.log('Сервис доступен по адресу:', `http://localhost:${service.port}`)
}