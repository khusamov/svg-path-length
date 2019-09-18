import SvgContainer from '../../SvgContainer';
import {ILengthCalculationResult} from '../plugins/AbstractLengthPlugin';

/**
 * Результат работы калькулятора.
 */
export default interface ITotalLengthCalculationResult {
	results: ILengthCalculationResult[];
	totalLength: number;
	hasErrors: boolean;
	sourceSvgContainer: SvgContainer;
	optimizedSvgContainer: SvgContainer;
}