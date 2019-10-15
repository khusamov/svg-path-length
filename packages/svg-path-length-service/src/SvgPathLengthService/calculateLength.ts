import {
	CircleLengthPlugin,
	EllipseLengthPlugin,
	PathLengthPlugin,
	SvgContainer,
	SvgLengthCalculator
} from 'svg-path-length-library';

export default async function calculateLength(filepath: string) {
	const svgContainer = await SvgContainer.createFromFile(filepath);
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
}