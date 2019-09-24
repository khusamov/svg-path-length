import SvgContainer, {ISvgContainer} from '../../SvgContainer';
import {ILengthCalculationResult} from '../plugins/AbstractLengthPlugin';

/**
 * Результат работы калькулятора.
 */
export default interface ITotalLengthCalculationResult {
	results: ILengthCalculationResult[];
	totalLength: ILength;
	hasErrors: boolean;
	sourceSvg: ISvgContainer;
	optimizedSvg: ISvgContainer;
}

export interface ILength {
	value: number;
	unit: string | undefined;
}