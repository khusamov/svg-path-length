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

type TGetTotalLengthLib = 'svg-path-properties' | 'point-at-length';

function getTotalLength(pathElementOrPathData: Element | string, lib: TGetTotalLengthLib = 'svg-path-properties'): number {
    const path = (
        typeof pathElementOrPathData === 'string'
            ? pathElementOrPathData
            : pathElementOrPathData.getAttribute('d')
    );
    switch (lib) {
        case 'svg-path-properties': return svgPathProperties(path).getTotalLength();
        case 'point-at-length': return PointAtLength(path).length();
    }
}

(async function() {
    const pkg = await import(__dirname + '/package.json');
    console.log(pkg.description);

    const test1SvgFile = await promisify(readFile)('test1.svg', 'utf-8');

    // Настройки.

    const isCalculateCirclesSeparately = true;

    // Сумма длин всех элементов при помощи пакета svgo.

    const svgo = new Svgo({
        plugins: [{convertShapeToPath: {convertArcs: !isCalculateCirclesSeparately}}, {mergePaths: false}]
    });

    const test1SvgOptimizedText = (await svgo.optimize(test1SvgFile)).data;
    const test1SvgOptimized = new DOMParser().parseFromString(test1SvgOptimizedText);

    const result = [];

    // Сумма path-элементов.

    const pathElements: Element[] = svgSelect('//svg:path', test1SvgOptimized) as Element[];
    const pathTotalLength = (
        pathElements.reduce(
            (result, pathElement) => result + getTotalLength(pathElement),
            0
        )
    );

    result.push({
        comment: 'Pathes',
        count: pathElements.length,
        length: pathTotalLength
    });

    // Сумма окружностей. Вычисляется, если convertArcs: false.
    // Сделано временно, так как имеются проблемы. Описание проблем см. по ссылкам:
    // https://github.com/jkroso/parse-svg-path/issues/4
    // https://github.com/rveciana/svg-path-properties/issues/25

    if (isCalculateCirclesSeparately) {
        const circleElements: Element[] = svgSelect('//svg:circle', test1SvgOptimized) as Element[];
        const getCircleLength = circleElement => {
            const radiusAttributeValue = circleElement.getAttribute('r');
            if (!radiusAttributeValue) {
                throw new Error('Радиус окружности отсутствует.');
            }
            const radius = Number(radiusAttributeValue);
            return 2 * Math.PI * radius;
        };
        const circleTotalLength = (
            circleElements.reduce(
                (result, circleElement) => result + getCircleLength(circleElement),
                0
            )
        );
        result.push({
            comment: 'Circles',
            count: circleElements.length,
            length: circleTotalLength
        });
    }

    // Сумма эллипсов. Вычисляется, если convertArcs: false.
    // Сделано временно, так как имеются проблемы, аналогичные окружностям.
    if (isCalculateCirclesSeparately) {
        const ellipseElements: Element[] = svgSelect('//svg:ellipse', test1SvgOptimized) as Element[];
        const getEllipseLength = ellipseElement => {
            // Подход к расчету длины эллипса взят со страницы
            // https://stackoverflow.com/questions/39866153/calculate-apprx-svg-ellipse-length-calculate-apprx-ellipse-circumference-wit
            const centerXAttributeValue = ellipseElement.getAttribute('cx');
            const centerYAttributeValue = ellipseElement.getAttribute('cy');
            const radiusRxAttributeValue = ellipseElement.getAttribute('rx');
            const radiusRyAttributeValue = ellipseElement.getAttribute('ry');
            if (!radiusRxAttributeValue || !radiusRyAttributeValue) {
                throw new Error('Радиус эллипса отсутствует.');
            }
            const centerX = Number(centerXAttributeValue);
            const centerY = Number(centerYAttributeValue);
            const radiusRx = Number(radiusRxAttributeValue);
            const radiusRy = Number(radiusRyAttributeValue);
            return (
                getTotalLength(`
                    M ${centerX} ${centerY}
                    m -${radiusRx}, 0
                    a ${radiusRx},${radiusRy} 0 1,1 ${radiusRx * 2},0
                    a ${radiusRx},${radiusRy} 0 1,1 -${radiusRx * 2},0
                `.split('\n').map(str => str.trim()).filter(str => str).join(' '))
            );
        };
        const ellipseTotalLength = (
            ellipseElements.reduce(
                (result, ellipseElement) => result + getEllipseLength(ellipseElement),
                0
            )
        );
        result.push({
            comment: 'Ellipses',
            count: ellipseElements.length,
            length: ellipseTotalLength
        });
    }

    // Вывод результатов:

    console.log(test1SvgFile);
    console.log(test1SvgOptimizedText);
    console.log();

    for (const resultItem of result) {
        console.log(`${resultItem.comment} (${resultItem.count}): ${resultItem.length}`);
    }
    console.log('Total:', result.reduce((result, resultItem) => result + resultItem.length, 0));

})();