import {DOMParser} from 'xmldom';
import {useNamespaces} from 'xpath';
import {readFile} from 'fs';
import {promisify} from 'util';


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

    // На данный момент сделано чтение аттрибута.
    console.log(lineNode.getAttribute('x1'));

})();