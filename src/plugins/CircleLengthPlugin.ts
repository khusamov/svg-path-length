import AbstractLengthPlugin, {ILengthCalculationResult, IPart} from './AbstractLengthPlugin';
import SvgContainer from '../SvgContainer';
import getCircleLength from '../functions/getCircleLength';

/**
 * Сумма окружностей. Вычисляется, если convertArcs: false.
 * Сделано временно, так как имеются проблемы. Описание проблем см. по ссылкам:
 * https://github.com/jkroso/parse-svg-path/issues/4
 * https://github.com/rveciana/svg-path-properties/issues/25
 */
export default class CircleLengthPlugin extends AbstractLengthPlugin {
	calculate(svg: SvgContainer): ILengthCalculationResult {
		const parts: IPart[] = (
			svg.select('//svg:circle').map(circleElement => {
				const part: IPart = {
					element: circleElement,
					markup: serialize(circleElement)
				};
				try {
					part.length = getCircleLength(circleElement);
				} catch (error) {
					part.error = error;
				}
				return part;
			})
		);
		const length = parts.reduce((totalLength, part) => totalLength + (part.length || 0), 0);
		const hasErrors = !!parts.find(part => 'error' in part);
		return {
			name: 'circle',
			hasErrors,
			parts,
			length
		};
	}
}

function serialize(circleElement: Element): string {
	const cx = circleElement.getAttribute('cx');
	const cy = circleElement.getAttribute('cy');
	const r = circleElement.getAttribute('r');
	return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
}