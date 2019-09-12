import AbstractLengthPlugin, {ILengthCalculationResult, IPart} from './AbstractLengthPlugin';
import SvgContainer from '../SvgContainer';
import getEllipseLength from '../functions/getEllipseLength';

/**
 * Сумма эллипсов. Вычисляется, если convertArcs: false.
 * Сделано временно, так как имеются проблемы, аналогичные окружностям.
 */
export default class EllipseLengthPlugin extends AbstractLengthPlugin {
	calculate(svg: SvgContainer): ILengthCalculationResult {
		const parts: IPart[] = (
			svg.select('//svg:ellipse').map(ellipseElement => {
				const part: IPart = {
					element: ellipseElement,
					markup: serialize(ellipseElement)
				};
				try {
					part.length = getEllipseLength(ellipseElement);
				} catch (error) {
					part.error = error;
				}
				return part;
			})
		);
		const length = parts.reduce((totalLength, part) => totalLength + (part.length || 0), 0);
		const hasErrors = !!parts.find(part => 'error' in part);
		return {
			name: 'ellipse',
			hasErrors,
			parts,
			length
		};
	}
}

function serialize(ellipseElement: Element): string {
	const cx = ellipseElement.getAttribute('cx');
	const cy = ellipseElement.getAttribute('cy');
	const rx = ellipseElement.getAttribute('rx');
	const ry = ellipseElement.getAttribute('ry');
	const transform = ellipseElement.getAttribute('transform');
	return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="${transform}"/>`;
}