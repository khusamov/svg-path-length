import SvgUnit from './SvgUnit';
import matchAll from '../utils/matchAll';

export interface ISvgSize {
	width: number;
	height: number;
	unit: string | undefined;
}

export default class SvgSize {
	static parse(documentElement: Element): ISvgSize | undefined {
		let result: ISvgSize | undefined;
		const width = getNumberFromSize(documentElement.getAttribute('width'));
		const height = getNumberFromSize(documentElement.getAttribute('height'));
		if (width !== undefined && height !== undefined) {
			result = {
				width,
				height,
				unit: SvgUnit.parse(documentElement)
			};
		}
		return result;
	}
}

function getNumberFromSize(value: string | undefined | null): number | undefined {
	let result;
	if (value) {
		const matches = matchAll(value, /^(\d+)/gm);
		if (matches.length) {
			result = matches[0][1];
		}
	}
	return result;
}