import SvgContainer from './src/SvgContainer';
import SvgLengthCalculator from './src/SvgLengthCalculator';
import SvgCalculationReport from './src/SvgCalculationReport';
import PathLengthPlugin from './src/plugins/PathLengthPlugin';
import CircleLengthPlugin from './src/plugins/CircleLengthPlugin';
import EllipseLengthPlugin from './src/plugins/EllipseLengthPlugin';
import {writeFile} from "fs";
import {promisify} from 'util';
import Path from 'path';

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

	const report = new SvgCalculationReport(totalLengthCalculationResult).toString();
	const reportFilename = Path.join(__dirname, 'temp/report.log');
	await promisify(writeFile)(reportFilename, report);
	console.log('Report save to file:', reportFilename);
})();