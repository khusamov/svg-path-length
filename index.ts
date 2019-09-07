import {readFile} from 'fs';
import {promisify} from 'util';
import {DOMParser} from 'xmldom';
import {useNamespaces} from 'xpath';
import PointAtLength from 'point-at-length';
import {svgPathProperties} from 'svg-path-properties';
import Svgo from 'svgo';

const svgSelect = useNamespaces({
    svg: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink'
});

(async function() {
    const pkg = await import(__dirname + '/package.json');
    console.log(pkg.description);

    const test1SvgFile = await promisify(readFile)('test1.svg', 'utf-8');

    console.log(test1SvgFile);

    // Длина элемента path.

    const test1Svg = new DOMParser().parseFromString(test1SvgFile);
    const lineNode: Element = svgSelect('//svg:line', test1Svg)[0] as Element;
    const pathNode: Element = svgSelect('//svg:path', test1Svg)[0] as Element;
    console.log(PointAtLength(pathNode.getAttribute('d')).length());
    console.log(svgPathProperties(pathNode.getAttribute('d')).getTotalLength());

    // Сумма длин всех path при помощи Svgo.

    const svgo = new Svgo({
        plugins: [{convertShapeToPath: true}, {mergePaths: false}]
    });

    const test1SvgOptimizedText = (await svgo.optimize(test1SvgFile)).data;
    const test1SvgOptimized = new DOMParser().parseFromString(test1SvgOptimizedText);
    const pathNodes: Element[] = svgSelect('//svg:path', test1SvgOptimized) as Element[];

    const totalLength = (
        pathNodes.reduce(
            (result, pathNode) => result + svgPathProperties(pathNode.getAttribute('d')).getTotalLength(),
            0
        )
    );
    console.log(test1SvgOptimizedText);
    console.log(pathNodes.length, totalLength);

})();