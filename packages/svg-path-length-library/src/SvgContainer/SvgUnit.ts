import matchAll from '../utils/matchAll';

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