import SvgContainer from '../SvgContainer';
import AbstractLengthPlugin from './plugins/AbstractLengthPlugin';
import ICalculationLengthOptions from './interface/ICalculationLengthOptions';
import ITotalLengthCalculationResult from './interface/ITotalLengthCalculationResult';
import optimize from './optimize';

/**
 * Калькулятор расчета длины линий в SVG-файле.
 * Расчеты делаются при помощи плагинов.
 */
export default class SvgLengthCalculator {
	constructor(private svgContainer: SvgContainer, private options: ICalculationLengthOptions = {}) {}

	/**
	 * Расcчитать длину всех линий.
	 * На вход следует подать плагины для расчета длин разных объектов.
	 * @param plugins
	 */
	async calculateLength(plugins: AbstractLengthPlugin[]): Promise<ITotalLengthCalculationResult> {
		const optimizedSvgText = await optimize(this.svgContainer.svgText, {
			convertArcs: !this.options.isCalculateCirclesSeparately
		});
		const optimizedSvgContainer = new SvgContainer(optimizedSvgText);
		const results = plugins.map(plugin => plugin.calculate(optimizedSvgContainer));
		const totalLength = results.reduce((totalLength, result) => totalLength + result.length, 0);
		const hasErrors = !!results.find(result => result.hasErrors);
		return {
			totalLength: {
				value: optimizedSvgContainer.convertCoord(totalLength),
				unit: optimizedSvgContainer.unit
			},
			results,
			hasErrors,
			sourceSvg: this.svgContainer.toJson(),
			optimizedSvg: optimizedSvgContainer.toJson()
		};
	}
}