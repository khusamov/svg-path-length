const namespaceMap: Record<string, string> = {
	svg: 'http://www.w3.org/2000/svg',
	xlink: 'http://www.w3.org/1999/xlink'
};

const namespaceResolver = (prefix: string | null): string | null => namespaceMap[prefix || ''] || null;

/**
 * Создание превьюшки.
 * Заменяются размеры на 100х100 пикселей.
 * Удаляются все узлы style.
 * @param svg
 */
export default function previewSvg(svg: string): string {
	const svgDocument = new DOMParser().parseFromString(svg, 'image/svg+xml');

	svgDocument.documentElement.setAttribute('width', '100px');
	svgDocument.documentElement.setAttribute('height', '100px');

	const styleNodesXPathResult = evaluate('//svg:style', svgDocument);

	getNodesFromXPathResult(styleNodesXPathResult).forEach(styleNode => {
		if (styleNode.parentElement) {
			styleNode.parentElement.removeChild(styleNode);
		}
	});

	return new XMLSerializer().serializeToString(svgDocument);
}

function evaluate(expression: string, ownerDocument: Document, contextNode?: Node): XPathResult {
	return (
		ownerDocument.evaluate(
			'//svg:style',
			contextNode || ownerDocument,
			namespaceResolver,
			XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
		)
	);
}

function getNodesFromXPathResult(result: XPathResult): Node[] {
	let nodes: Node[] = [], node, i = 0;
	while (!!(node = result.snapshotItem(i++))) nodes.push(node);
	return nodes;
}