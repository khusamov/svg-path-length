export default interface IConfigExports {
	calculatePrice: TCalculatePriceFunction;
	getMaterialTable: TGetMaterialTableFunction;
}

export type TCalculatePriceFunction = (length: number, thickness: number, material: string) => ICalculatePriceResult;
export type TGetMaterialTableFunction = () => IMaterialTableItem[];

interface ICalculatePriceResult {
	value: number;
	unit: string;
}

export interface IMaterialTableItem {
	name: string;
	code: string;
	price: IPriceByThickness;
	/**
	 * Скорость реза, мм/мин, для каждой толщины.
	 * Время реза считается как длина / скорость.
	 */
	speed: ISpeedByThickness;
}

/**
 * Скорость реза в зависимости от толщины материала.
 * Толщина задается в мм, скорость — в мм/мин.
 */
export interface ISpeedByThickness {
	[thickness: number]: number;
}

/**
 * Набор таблиц с ценами, в зависимости от толщины материала.
 */
export interface IPriceByThickness {
	/**
	 * Соответствие толщины материала и таблицы с ценами для данной толщины.
	 * Толщина задается в мм.
	 */
	[thickness: number]: IPriceItem[];
}

export interface IPriceItem {
	/**
	 * Цена в рублях за метр длины реза.
	 */
	price: number;

	/**
	 * Диапазон длины реза, для которого разрешена данная цена.
	 * Длина задается в мм.
	 */
	length: {
		min: number;
		max: number;
	}
}