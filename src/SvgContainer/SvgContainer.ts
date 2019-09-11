import {useNamespaces} from 'xpath';
import {readFile} from "fs";
import {promisify} from 'util';
import {DOMParser} from 'xmldom';
import Prettier, {Options} from 'prettier';
import ViewBox, {IViewBox} from './ViewBox';
import SvgUnit from './SvgUnit';
import SvgSize, {ISvgSize} from './SvgSize';

const prettierOptions: Options = {
	useTabs: true,
	semi: true,
	singleQuote: true,
	parser: 'html' // xml|svg пока не поддерживается
};

const svgSelect = useNamespaces({
	svg: 'http://www.w3.org/2000/svg',
	xlink: 'http://www.w3.org/1999/xlink'
});

/**
 * Контейнер для SVG-данных.
 * К контейнеру можно подключить плагины, которые делают расчет длин элементов.
 */
export default class SvgContainer {
	static async createFromFile(filePath: string) {
		const fileContentText: string = await promisify(readFile)(filePath, 'utf-8');
		return new SvgContainer(fileContentText);
	}

	svgDocument: Document;

	get viewBox(): IViewBox | undefined {
		return ViewBox.parse(this.svgDocument.documentElement);
	}

	get unit(): string | undefined {
		return SvgUnit.parse(this.svgDocument.documentElement);
	}

	get size(): ISvgSize | undefined {
		return SvgSize.parse(this.svgDocument.documentElement);
	}

	private _svgText: string;

	get svgText(): string {
		return this._svgText;
	}

	set svgText(svgText: string) {
		this._svgText = Prettier.format(svgText, prettierOptions);
		this.svgDocument = new DOMParser().parseFromString(svgText);
	}

	constructor(svgText: string) {
		this.svgText = svgText;
	}

	/**
	 * Основной метод для доступа к SVG-данным при помощи XPath.
	 * @param xpath
	 */
	select(xpath: string): Element[] {
		return svgSelect(xpath, this.svgDocument) as Element[]
	}

	/**
	 * Приведение координаты или длины к единице измерения документа.
	 * @param coord
	 */
	convertCoord(coord: number): number {
		return coord;
	}
}