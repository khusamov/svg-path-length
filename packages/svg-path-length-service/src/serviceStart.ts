import {install} from 'source-map-support';
import {join} from 'path';
import SvgPathLengthService from './SvgPathLengthService';

install();

/**
 * Специальный скрипт для запуска веб-сервиса.
 */
export async function serviceStart() {
	const packageJson = await import(join(__dirname, '../package.json'));
	console.log(packageJson.description);
	console.log('Версия:', packageJson.version);

	const service = new SvgPathLengthService(packageJson);
	await service.listen();
	console.log('Сервис доступен по адресу:', `http://localhost:${service.port}`)
}