import {
	CircleLengthPlugin,
	EllipseLengthPlugin,
	PathLengthPlugin,
	SvgContainer,
	SvgLengthCalculator
} from 'svg-path-length-library';
import {convertCdrToSvgFile, isCdrFile} from './convertCdrToSvg';

export default async function calculateLength(filepath: string, originalName = '') {
	let svgFilePath = filepath;
	let cleanup: (() => Promise<void>) | undefined;
	if (isCdrFile(originalName)) {
		const converted = await convertCdrToSvgFile(filepath);
		svgFilePath = converted.svgPath;
		cleanup = converted.cleanup;
	}

	try {
		const svgContainer = await SvgContainer.createFromFile(svgFilePath);
		const svgLengthCalculator = (
			new SvgLengthCalculator(svgContainer, {
				isCalculateCirclesSeparately: true
			})
		);
		return (
			await svgLengthCalculator.calculateLength([
				new PathLengthPlugin,
				new CircleLengthPlugin,
				new EllipseLengthPlugin
			])
		);
	} finally {
		if (cleanup) await cleanup();
	}
}