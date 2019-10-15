export default interface IConfigExports {
	calculatePrice: TCalculatePriceFunction;
	getMaterialTable: TGetMaterialTableFunction;
}

export type TCalculatePriceFunction = (length: number, thickness: number, material: string) => number;
export type TGetMaterialTableFunction = () => IMaterialTableItem[];

export interface IMaterialTableItem {
	name: string;
	code: string;
	price: IPriceByThickness;
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