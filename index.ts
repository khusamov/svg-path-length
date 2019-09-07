import {DOMParser} from 'xmldom';
import {useNamespaces} from 'xpath';
import {readFile} from 'fs';
import {promisify} from 'util';
import PointAtLength from 'point-at-length';
import {svgPathProperties} from 'svg-path-properties';


(async function() {
    const pkg = await import(__dirname + '/package.json');
    console.log(pkg.description);

    const test1SvgFile = await promisify(readFile)('test1.svg', 'utf-8');

    console.log(test1SvgFile);

    const test1Svg = new DOMParser().parseFromString(test1SvgFile);

    const svgSelect = useNamespaces({
        svg: 'http://www.w3.org/2000/svg',
        xlink: 'http://www.w3.org/1999/xlink'
    });
    const lineNode: Element = svgSelect('//svg:line', test1Svg)[0] as Element;
    const pathNode: Element = svgSelect('//svg:path', test1Svg)[0] as Element;

    // На данный момент сделано чтение аттрибута.
    console.log(lineNode.getAttribute('x1'));
    console.log(pathNode.getAttribute('d'));

    // Длина элемента path.
    console.log(PointAtLength(pathNode.getAttribute('d')).length());
    console.log(svgPathProperties(pathNode.getAttribute('d')).getTotalLength());

})();