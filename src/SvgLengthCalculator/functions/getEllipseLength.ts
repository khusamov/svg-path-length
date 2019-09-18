import getPathTotalLength from './getPathTotalLength';
import {parse as parseSvgTransform} from 'svg-transform-parser2';

interface ITransform {
	key: string;
	value: any;
}

/**
 * Расчет длины эллипса.
 * Подход к расчету длины эллипса взят со страницы
 * https://stackoverflow.com/questions/39866153/calculate-apprx-svg-ellipse-length-calculate-apprx-ellipse-circumference-wit
 * @param ellipseElement
 */
export default function getEllipseLength(ellipseElement) {
	const radiusRxAttributeValue = ellipseElement.getAttribute('rx');
	const radiusRyAttributeValue = ellipseElement.getAttribute('ry');
	if (!radiusRxAttributeValue || !radiusRyAttributeValue) {
		throw new Error('Радиус эллипса отсутствует.');
	}

	let centerXAttributeValue = ellipseElement.getAttribute('cx');
	let centerYAttributeValue = ellipseElement.getAttribute('cy');
	if (!(centerXAttributeValue && centerXAttributeValue)) {
		const transform = parseSvgTransform(ellipseElement.getAttribute('transform')) as ITransform[];
		if (!transform.length) {
			// Для вычисления длины требуется наличие или координат или rotate.
			throw new Error('Координаты и transform эллипса отсутствуют.');
		}
		if (transform.length > 1) {
			throw new Error('Количество трансформаций эллипса больше одного.');
		}
		if (transform[0].key !== 'rotate') {
			throw new Error(`Недопустимая трасформация ${transform[0].key}.`);
		}
		centerXAttributeValue = transform[0].value.cx;
		centerYAttributeValue = transform[0].value.cy;
	}

	const centerX = Number(centerXAttributeValue);
	const centerY = Number(centerYAttributeValue);
	const radiusRx = Number(radiusRxAttributeValue);
	const radiusRy = Number(radiusRyAttributeValue);

	const ellipsePath = convertEllipseToPath(centerX, centerY, radiusRx, radiusRy);

	return getPathTotalLength(ellipsePath);
};

/**
 * Конвертирование эллипса в path-данные.
 * https://stackoverflow.com/questions/39866153/calculate-apprx-svg-ellipse-length-calculate-apprx-ellipse-circumference-wit
 * @param centerX
 * @param centerY
 * @param radiusRx
 * @param radiusRy
 */
function convertEllipseToPath(centerX, centerY, radiusRx, radiusRy) {
	const ellipsePath = `
		M ${centerX} ${centerY}
		m -${radiusRx}, 0
		a ${radiusRx},${radiusRy} 0 1,1 ${radiusRx * 2},0
		a ${radiusRx},${radiusRy} 0 1,1 -${radiusRx * 2},0
	`;
	return trimStringText(ellipsePath);
}

/**
 * Конвертация текстового блока в строку без переносов строк. Между строками ставится пробел.
 * @param text
 */
function trimStringText(text) {
	return text.split('\n').map(str => str.trim()).filter(str => str).join(' ')
}

/**
 * Приближенная формула расчета длины эллипса. Более точный результат дает подход через конвертацию в path.
 *
 * При использовании с, rx="39.49"и ry="8.41"это дало мне значение 164.20811705227723, и Google говорит мне,
 * что фактическая длина окружности 166.79. Не так уж плохо и просто отлично подходит для SVG-анимации.
 * https://stackoverflow.com/questions/39866153/calculate-apprx-svg-ellipse-length-calculate-apprx-ellipse-circumference-wit
 * @param ellipse
 */
function getEllipseLength2(ellipse) {
	let rx = parseInt(ellipse.getAttribute('rx'));
	let ry = parseInt(ellipse.getAttribute('ry'));
	let h = Math.pow((rx-ry), 2) / Math.pow((rx + ry), 2);
	return (Math.PI * ( rx + ry )) * (1 + ( (3 * h) / ( 10 + Math.sqrt( 4 - (3 * h) )) ));
}