import {IViewBox} from './ViewBox';
import {ISvgSize} from './SvgSize';

export default interface ISvgContainer {
	viewBox: IViewBox | undefined;
	unit: string | undefined;
	size: ISvgSize | undefined;
	svgText: string;
}