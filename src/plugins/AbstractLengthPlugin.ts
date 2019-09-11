import SvgContainer from '../SvgContainer';

export interface IPart {
	element: Element;
	html: string;

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

export interface ILengthCalculationResult {
	name: string;
	length: number;
	parts: IPart[];

	/**
	 * Флаг, указывающий имеет ли ошибки массив parts или нет.
	 */
	hasErrors: boolean;
}

export default abstract class AbstractLengthPlugin {
	abstract calculate(svg: SvgContainer): ILengthCalculationResult;
}