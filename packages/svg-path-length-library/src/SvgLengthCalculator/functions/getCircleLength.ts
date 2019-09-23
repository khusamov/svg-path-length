export default function getCircleLength(circleElement) {
	const radiusAttributeValue = circleElement.getAttribute('r');
	if (!radiusAttributeValue) {
		throw new Error('Радиус окружности отсутствует.');
	}
	const radius = Number(radiusAttributeValue);
	return 2 * Math.PI * radius;
};