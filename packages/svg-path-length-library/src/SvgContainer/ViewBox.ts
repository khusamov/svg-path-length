export interface IViewBox {
	x: number;
	y: number;
	width: number;
	height: number;
}

export default class ViewBox {
	static parse(element: Element): IViewBox | undefined {
		let viewBox: IViewBox | undefined;
		const viewBoxValue = element.getAttribute('viewBox');
		if (viewBoxValue) {
			viewBox = {
				x: Number(viewBoxValue.split(' ')[0]),
				y: Number(viewBoxValue.split(' ')[1]),
				width: Number(viewBoxValue.split(' ')[2]),
				height: Number(viewBoxValue.split(' ')[3]),
			};
		}
		return viewBox;
	}
}