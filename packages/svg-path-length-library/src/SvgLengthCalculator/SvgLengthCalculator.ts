import SvgContainer from '../SvgContainer';
import AbstractLengthPlugin from './plugins/AbstractLengthPlugin';
import ICalculationLengthOptions from './interface/ICalculationLengthOptions';
import ITotalLengthCalculationResult from './interface/ITotalLengthCalculationResult';
import optimize from './optimize';

/**
 * Калькулятор расчета длины линий в SVG-файле.
 */
export default class SvgLengthCalculator {
	constructor(private svgContainer: SvgContainer, private options: ICalculationLengthOptions = {}) {}

	async calculate(plugins: AbstractLengthPlugin[]): Promise<ITotalLengthCalculationResult> {
		const optimizedSvgText = await optimize(this.svgContainer.svgText, {
			convertArcs: !this.options.isCalculateCirclesSeparately
		});
		const optimizedSvgContainer = new SvgContainer(optimizedSvgText);
		const results = plugins.map(plugin => plugin.calculate(optimizedSvgContainer));
		const totalLength = results.reduce((totalLength, result) => totalLength + result.length, 0);
		const hasErrors = !!results.find(result => result.hasErrors);
		return {results, hasErrors, totalLength, sourceSvgContainer: this.svgContainer, optimizedSvgContainer};
	}
}