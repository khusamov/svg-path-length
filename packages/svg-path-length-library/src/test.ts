import SvgContainer from './SvgContainer';
import SvgLengthCalculator from './SvgLengthCalculator';
import SvgCalculationReport from './SvgCalculationReport';
import PathLengthPlugin from './SvgLengthCalculator/plugins/PathLengthPlugin';
import CircleLengthPlugin from './SvgLengthCalculator/plugins/CircleLengthPlugin';
import EllipseLengthPlugin from './SvgLengthCalculator/plugins/EllipseLengthPlugin';
import {writeFile} from 'fs';
import {promisify} from 'util';
import {join} from 'path';

(async () => {
	const pkg = await import(join(__dirname, '../package.json'));
	console.log(pkg.description);
	console.log(pkg.version);

	const svgContainer = await SvgContainer.createFromFile(join(__dirname, '../test/test1.svg'));
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

	const report = new SvgCalculationReport(totalLengthCalculationResult).toString();
	const reportFilename = join(__dirname, '../temp/report.log');
	await promisify(writeFile)(reportFilename, report);
	console.log('Report save to file:', reportFilename);
})();