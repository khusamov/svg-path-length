import {useNamespaces} from 'xpath';
import {readFile} from "fs";
import {promisify} from 'util';
import Svgo from 'svgo';
import {DOMParser} from 'xmldom';

const svgSelect = useNamespaces({
	svg: 'http://www.w3.org/2000/svg',
	xlink: 'http://www.w3.org/1999/xlink'
});

interface ICalculationLengthOptions {
	isCalculateCirclesSeparately: boolean;
}

/**
 * Контейнер для SVG-данных.
 * К контейнеру можно подключить плагины, которые делают расчет длин элементов.
 */
export default class SvgContainer {
	static async createFromFile(filePath: string, options: ICalculationLengthOptions) {
		const fileContentText: string = await promisify(readFile)(filePath, 'utf-8');
		return new SvgContainer(fileContentText, options);
	}

	static async optimize(test1SvgFile, options: ICalculationLengthOptions): Promise<string> {
		const svgo = new Svgo({
			plugins: [{
				convertShapeToPath: {
					convertArcs: !options.isCalculateCirclesSeparately
				}
			}, {
				mergePaths: false
			}]
		});

		return (await svgo.optimize(test1SvgFile)).data;
	}

	svg: Document;

	ready: Promise<SvgContainer>;

	constructor(svgDataText: string, options: ICalculationLengthOptions) {
		this.ready = (async () => {
			this.svg = new DOMParser().parseFromString(await SvgContainer.optimize(svgDataText, options));
			return this;
		})();
	}

	/**
	 * Основной метод для доступа к SVG-данным при помощи XPath.
	 * @param xpath
	 */
	select(xpath: string): Element[] {
		return svgSelect('//svg:path', this.svg) as Element[]
	}
}