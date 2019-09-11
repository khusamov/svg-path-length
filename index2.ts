import SvgContainer from './src/SvgContainer';
import SvgLengthCalculator from './src/SvgLengthCalculator';
import SvgCalculationReport from './src/SvgCalculationReport';
import PathLengthPlugin from './src/plugins/PathLengthPlugin';
import CircleLengthPlugin from './src/plugins/CircleLengthPlugin';
import EllipseLengthPlugin from './src/plugins/EllipseLengthPlugin';

(async () => {
	const pkg = await import(__dirname + '/package.json');
	console.log(pkg.description);

	const svgContainer = await SvgContainer.createFromFile('test1.svg');
	const svgLengthCalculator = (
		new SvgLengthCalculator(svgContainer, {
			isCalculateCirclesSeparately: true
		})
	);
	const totalLengthCalculationResult = (
		await svgLengthCalculator.calculate([
			new PathLengthPlugin,
			new CircleLengthPlugin,
			new EllipseLengthPlugin
		])
	);

	console.log(new SvgCalculationReport(totalLengthCalculationResult).toString());
})();