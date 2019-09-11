import SvgUnit from './SvgUnit';

export interface ISvgSize {
	width: number;
	height: number;
	unit: string;
}

export default class SvgSize {
	static parse(documentElement: Element): ISvgSize | undefined {

		let result: ISvgSize | undefined;

		const widthValue = documentElement.getAttribute('width');
		const heigthValue = documentElement.getAttribute('heigth');

		if (widthValue && heigthValue) {
			result = {
				width: 0,
				height: 0,
				unit: SvgUnit.parse(documentElement)
			};
		}

		return result;
	}
}