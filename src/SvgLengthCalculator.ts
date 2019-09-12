import SvgContainer from './SvgContainer';
import AbstractLengthPlugin, {ILengthCalculationResult} from './plugins/AbstractLengthPlugin';
import Svgo from 'svgo';

export interface ITotalLengthCalculationResult {
	results: ILengthCalculationResult[];
	totalLength: number;
	hasErrors: boolean;
	sourceSvgContainer: SvgContainer;
	optimizedSvgContainer: SvgContainer;
}

interface ICalculationLengthOptions {
	/**
	 * Если флаг поднят, то окружности, эллипсы и дуги не будут конвертироваться в пути (path)
	 * и их длины будут вычисляться отдельно.
	 */
	isCalculateCirclesSeparately: boolean;
}

export default class SvgLengthCalculator {
	constructor(private svgContainer: SvgContainer, private options: ICalculationLengthOptions) {}

	async calculate(plugins: AbstractLengthPlugin[]): Promise<ITotalLengthCalculationResult> {

		const svgo = new Svgo({
			plugins: [{
				convertShapeToPath: {
					convertArcs: !this.options.isCalculateCirclesSeparately
				}
			}, {
				mergePaths: false
			}, {
				removeStyleElement: true
			}, {
				removeScriptElement: true
			}, {
				// https://github.com/svg/svgo/blob/master/plugins/convertPathData.js
				convertPathData: {
					// Похоже проблема
					// https://github.com/svg/svgo/issues/1151
					// решается этой опцией:
					noSpaceAfterFlags: false
				}
			}]
		});
		const optimizedSvgText = (await svgo.optimize(this.svgContainer.svgText)).data;
		const optimizedSvgContainer = new SvgContainer(optimizedSvgText);


		console.log('viewBox', optimizedSvgContainer.unit)

		const results = plugins.map(plugin => plugin.calculate(optimizedSvgContainer));
		const totalLength = results.reduce((totalLength, result) => totalLength + result.length, 0);
		const hasErrors = !!results.find(result => result.hasErrors);
		return {results, hasErrors, totalLength, sourceSvgContainer: this.svgContainer, optimizedSvgContainer};
	}
}