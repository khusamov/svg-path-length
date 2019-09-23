/**
 * https://learn.javascript.ru/regexp-methods#str-matchall-regexp
 * @param str
 * @param regexp
 */
export default function matchAll(str: string, regexp: RegExp) {
	const result: RegExpExecArray[] = [];
	let m;
	while ((m = regexp.exec(str)) !== null) {
		// Это необходимо, чтобы избежать бесконечных циклов с совпадениями нулевой ширины.
		if (m.index === regexp.lastIndex) {
			regexp.lastIndex++;
		}

		result.push(m);
	}
	return result;
}