import SvgContainer from '../../SvgContainer';

/**
 * Найденный плагином элемент. Точнее информация об элементе.
 */
export interface IPart {
	/**
	 * Ссылка на найденный элементов из DOM.
	 */
	element: Element;

	/**
	 * Текстовое SVG-представление элемента.
	 */
	markup: string;

	/**
	 * Длина линии элемента (периметр).
	 * Если длины нет, значит при ее вычислении была ошибка, которая записана в error.
	 */
	length?: number;

	/**
	 * Ошибка при вычислении длины.
	 */
	error?: Error;
}

/**
 * Результат вычисления длины элементов плагином.
 * Плагин должен вычислять длину только одного типа элементов.
 */
export interface ILengthCalculationResult {
	/**
	 * Имя вычисляемого элемента.
	 * Например path или ellipse.
	 */
	name: string;

	/**
	 * Длина всех найденных элементов.
	 */
	length: number;

	/**
	 * Массив найденных элементов.
	 */
	parts: IPart[];

	/**
	 * Флаг, указывающий имеет ли ошибки массив parts или нет.
	 */
	hasErrors: boolean;
}

export default abstract class AbstractLengthPlugin {
	abstract calculate(svg: SvgContainer): ILengthCalculationResult;
}