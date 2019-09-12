import AbstractLengthPlugin, {ILengthCalculationResult, IPart} from './AbstractLengthPlugin';
import SvgContainer from '../SvgContainer';
import getPathTotalLength from '../functions/getPathTotalLength';

/**
 * Вычисление суммы длин всех path-элементов.
 */
export default class PathLengthPlugin extends AbstractLengthPlugin {
	calculate(svg: SvgContainer): ILengthCalculationResult {
		const parts: IPart[] = (
			svg.select('//svg:path').map(pathElement => {
				const part: IPart = {
					element: pathElement,
					markup: serialize(pathElement)
				};
				try {
					part.length = getPathTotalLength(pathElement);
				} catch (error) {
					part.error = error;
				}
				return part;
			})
		);
		const length = parts.reduce((totalLength, part) => totalLength + (part.length || 0), 0);
		const hasErrors = !!parts.find(part => 'error' in part);
		return {
			name: 'path',
			hasErrors,
			parts,
			length
		};
	}
}

function serialize(pathElement: Element): string {
	const d = pathElement.getAttribute('d');
	return `<path d="${d}"/>`;
}