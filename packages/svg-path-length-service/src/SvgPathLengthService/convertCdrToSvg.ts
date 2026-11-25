import {copyFile, mkdtemp, readFile, writeFile} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';
import {spawn} from 'child_process';
import {promisify} from 'util';

const copyFileAsync = promisify(copyFile);
const mkdtempAsync = promisify(mkdtemp);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export function isCdrFile(fileName: string): boolean {
	return /\.cdr$/i.test(fileName);
}

/**
 * CorelDRAW хранит чертёж в закрытом формате.
 * LibreOffice открывает CDR и выгружает его в SVG, после чего длину считает обычный калькулятор.
 * Шаблоны маркеров лежат в defs, а вокруг каждой фигуры LibreOffice рисует rect.BoundingBox.
 * И то и другое не является линией реза, поэтому перед расчётом убирается.
 */
export async function convertCdrToSvgFile(sourcePath: string): Promise<{svgPath: string; cleanup: () => Promise<void>}> {
	const tempDir = await mkdtempAsync(join(tmpdir(), 'svg-path-length-cdr-'));
	const cleanup = () => removeTemp(tempDir);
	const cdrPath = join(tempDir, 'input.cdr');
	await copyFileAsync(sourcePath, cdrPath);

	try {
		await runSoffice(tempDir, cdrPath);
		const rawSvg = await readFileAsync(join(tempDir, 'input.svg'), 'utf8');
		const svgPath = join(tempDir, 'drawing.svg');
		await writeFileAsync(svgPath, prepareConvertedSvg(rawSvg), 'utf8');
		return {svgPath, cleanup};
	} catch (error) {
		await cleanup();
		throw error;
	}
}

function prepareConvertedSvg(svg: string): string {
	return svg
		.replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/gi, '')
		.replace(/<rect\b[^>]*\bclass=["']BoundingBox["'][^>]*\/>/gi, '');
}

function runSoffice(tempDir: string, cdrPath: string): Promise<void> {
	const profileDir = join(tempDir, 'profile');
	const args = [
		`-env:UserInstallation=file://${profileDir}`,
		'--headless',
		'--norestore',
		'--nofirststartwizard',
		'--convert-to',
		'svg',
		'--outdir',
		tempDir,
		cdrPath
	];

	return new Promise((resolve, reject) => {
		const child = spawn('soffice', args, {stdio: ['ignore', 'ignore', 'pipe']});
		let stderr = '';
		const timeout = setTimeout(() => {
			child.kill();
			reject(new Error('Конвертация CDR превысила 60 секунд.'));
		}, 60000);

		child.stderr.on('data', (chunk: Buffer) => {
			stderr += chunk.toString();
		});
		child.on('error', (error: NodeJS.ErrnoException) => {
			clearTimeout(timeout);
			if (error.code === 'ENOENT') {
				reject(new Error('Не удалось конвертировать CDR: LibreOffice (soffice) не найден.'));
				return;
			}
			reject(error);
		});
		child.on('close', (code: number | null) => {
			clearTimeout(timeout);
			if (code === 0) {
				resolve();
				return;
			}
			const details = stderr.trim();
			reject(new Error(details
				? `Не удалось конвертировать CDR: ${details}`
				: `Не удалось конвертировать CDR: soffice завершился с кодом ${code}.`));
		});
	});
}

function removeTemp(tempDir: string): Promise<void> {
	return new Promise(resolve => {
		const child = spawn('rm', ['-rf', tempDir], {stdio: 'ignore'});
		child.on('error', () => resolve());
		child.on('close', () => resolve());
	});
}
