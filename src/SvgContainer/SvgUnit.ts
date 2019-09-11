export default class SvgUnit {
	static parse(documentElement: Element): string | undefined {
		let result;
		const widthValue = documentElement.getAttribute('width');
		if (widthValue) {
			const matches = matchAll(widthValue, /([a-zA-Z]+)$/gm);
			if (matches.length) {
				result = matches[0][1];
			}
		}
		return result;
	}
}

/**
 * https://learn.javascript.ru/regexp-methods#str-matchall-regexp
 * @param str
 * @param regexp
 */
function matchAll(str: string, regexp: RegExp) {
	const result = [];
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