/**
 * Чтение текста из объекта File.
 * @link https://learn.javascript.ru/file
 */
export default async function readAsText(file: File): Promise<string> {
	return (
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(readResult(reader.result));
			reader.onerror = () => reject(reader.error);
			reader.onabort = () => reject(new Error('Неожиданно вызван FileReader.abort().'));
			reader.readAsText(file);
		})
	);
}

/**
 * Чтение текста из результата FileReader.
 * @param result
 */
function readResult(result: string | ArrayBuffer | null): string {
	if (result instanceof ArrayBuffer) {
		throw new Error('Результат ожидается в виде текста.');
	}
	return result === null ? '' : result;
}