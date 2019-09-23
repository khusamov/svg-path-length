/**
 * Параметры калькулятора.
 */
export default interface ICalculationLengthOptions {
	/**
	 * Если флаг поднят, то окружности, эллипсы и дуги не будут конвертироваться в пути (path)
	 * и их длины будут вычисляться отдельно.
	 */
	isCalculateCirclesSeparately?: boolean;
}