import * as NodeSsh from 'node-ssh';
import config from './deploy.config.js';

const ssh = new NodeSsh;

(async () => {

	try {

		await ssh.connect(config);

		const result = (
			await ssh.execCommand('rm -fr *', {
				cwd: '/var/www/khusamov/data/www/svg-path-length.khusamov.ru'
			})
		);

		// console.log(result.stdout);
		// console.log(result.stderr);

		const status = await ssh.putDirectory(
			'D:\\REPO\\github\\svg-path-length\\packages\\svg-path-length-client\\build',
			'/var/www/khusamov/data/www/svg-path-length.khusamov.ru',
			{
				recursive: true,
				// Если concurrency > 1, то начинаются проблемы с выгрузкой файлов.
				// Описание concurrency см. https://www.npmjs.com/package/p-map
				concurrency: 1,
				tick(localPath, remotePath, error) {
					if (error) {
						console.log('tick error:', localPath, error)
					}
				}
			}
		);

		console.log('status', status)


	} catch (error) {
		console.log('error.code=', error.code);
		console.log(error);
	}




	process.exit(0);
})();