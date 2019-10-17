/**
 * Пример конфигурационного файла
 * для сервиса расчета цены лазерного реза фанеры.
 */

import {IPriceByThickness, IMaterialTableItem, TCalculatePriceFunction, TGetMaterialTableFunction} from './src/interfaces/IConfigExports';

const price: IPriceByThickness = {
	3: [{length: {min: 0, max: 100}, price: 24}, {length: {min: 100, max: 500}, price: 16}, {length: {min: 500, max: 5000}, price: 13}],
	4: [{length: {min: 0, max: 100}, price: 29}, {length: {min: 100, max: 500}, price: 19}, {length: {min: 500, max: 5000}, price: 16}]
};

/**
 * Таблица материалов с ценами.
 * Цены представлены в таблице: Толщина (мм), Длина (мм), Цена (руб./метр).
 */
const materialTable: IMaterialTableItem[] = [{
	name: 'Фанера',
	code: 'plywood',
	price
}, {
	name: 'Оргстекло',
	code: 'plywood',
	price
}, {
	name: 'МДФ (ДВП)',
	code: 'fibreboard',
	price
}, {
	name: 'Массив дерева',
	code: 'solid-wood',
	price
}, {
	name: 'Картон',
	code: 'cardboard',
	price
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