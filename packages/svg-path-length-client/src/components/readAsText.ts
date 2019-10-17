type TFileReaderResult = string | ArrayBuffer | null;

/**
 * Чтение текста из объекта File.
 * @link https://learn.javascript.ru/file
 */
export default async function readAsText(file: File): Promise<string> {
	return (
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(readResultAsText(reader.result));
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
function readResultAsText(result: TFileReaderResult): string {
	if (result instanceof ArrayBuffer) {
		// TODO Добавить конвертацию ArrayBuffer в текст.
		throw new Error('Результат ожидается в виде текста.');
	}
	return result === null ? '' : result;
}