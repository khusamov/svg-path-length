export default function isElement(element: any): element is Element {
	return (
		typeof element === 'object'
		&& 'getAttribute' in element
		&& typeof element.getAttribute === 'function'
	);
}