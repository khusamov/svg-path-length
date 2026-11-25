/**
 * Пример конфигурационного файла
 * для сервиса расчета цены лазерного реза фанеры.
 */

import {IPriceByThickness, IMaterialTableItem, ISpeedByThickness, TCalculatePriceFunction, TGetMaterialTableFunction} from './src/interfaces/IConfigExports';

const price: IPriceByThickness = {
	3: [{length: {min: 0, max: 100}, price: 24}, {length: {min: 100, max: 500}, price: 16}, {length: {min: 500, max: 5000}, price: 13}],
	4: [{length: {min: 0, max: 100}, price: 29}, {length: {min: 100, max: 500}, price: 19}, {length: {min: 500, max: 5000}, price: 16}]
};

/**
 * Скорость сквозного реза, мм/мин, для толщин 3 и 4 мм.
 */
const speed = {
	plywood: {3: 900, 4: 550} as ISpeedByThickness,
	acrylic: {3: 1400, 4: 900} as ISpeedByThickness,
	fibreboard: {3: 700, 4: 420} as ISpeedByThickness,
	solidWood: {3: 350, 4: 220} as ISpeedByThickness,
	cardboard: {3: 4000, 4: 2800} as ISpeedByThickness
};

/**
 * Таблица материалов с ценами и скоростью реза.
 * Цены представлены в таблице: Толщина (мм), Длина (мм), Цена (руб./метр).
 * Скорость задается в мм/мин и используется для расчета времени реза.
 */
const materialTable: IMaterialTableItem[] = [{
	name: 'Фанера',
	code: 'plywood',
	price,
	speed: speed.plywood
}, {
	name: 'Оргстекло',
	code: 'plywood',
	price,
	speed: speed.acrylic
}, {
	name: 'МДФ (ДВП)',
	code: 'fibreboard',
	price,
	speed: speed.fibreboard
}, {
	name: 'Массив дерева',
	code: 'solid-wood',
	price,
	speed: speed.solidWood
}, {
	name: 'Картон',
	code: 'cardboard',
	price,
	speed: speed.cardboard
}];

/**
 * Расчет цены реза.
 * @param length Длина реза, мм.
 * @param thickness Толщина материала.
 * @param material Тип материала.
 */
export const calculatePrice: TCalculatePriceFunction = (
	(length, thickness, material) => {
		const materialData = materialTable.find(materialData => materialData.code === material);
		if (!materialData) throw new Error(`Не найден материал '${material}'`);

		const priceTable = materialData.price[thickness];
		if (!priceTable) throw new Error(`Не найдена толщина ${thickness} для материала ${material}`);

		const item = priceTable.find(item => item.length.min <= length && length < item.length.max);
		if (!item) throw new Error(`Не найдена цена реза длиной ${length} мм для материала ${material} (${thickness} мм)`);

		return {
			value: item.price * (length / 100),
			unit: 'руб.'
		};
	}
);

/**
 * Получить массив материалов с их данными.
 */
export const getMaterialTable: TGetMaterialTableFunction = () => materialTable;