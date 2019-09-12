import {svgPathProperties} from "svg-path-properties";
import PointAtLength from 'point-at-length';
import isElement from '../utils/isElement';

type TGetTotalLengthLib = 'svg-path-properties' | 'point-at-length';

/**
 * The SVGPathElement.getTotalLength() method returns the user agent's computed
 * value for the total length of the path in user units.
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/API/SVGPathElement/getTotalLength
 * @param pathElementOrPathData
 * @param lib
 */
export default function getPathTotalLength(pathElementOrPathData: Element | string, lib: TGetTotalLengthLib = 'svg-path-properties'): number {
	const path: string = (
		isElement(pathElementOrPathData)
			? pathElementOrPathData.getAttribute('d')
			: pathElementOrPathData
	);
	switch (lib) {
		case 'svg-path-properties': return svgPathProperties(path).getTotalLength();
		case 'point-at-length': return PointAtLength(path).length();
	}
}