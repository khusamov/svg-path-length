/**
 * Пример конфигурационного файла
 * для сервиса расчета цены лазерного реза фанеры.
 */

/**
 * Таблица материалов с ценами.
 * Цены представлены в таблице: Толщина (мм), Длина (мм), Цена (руб./метр).
 */
const materialTable = [{
	name: 'Фанера',
	code: 'plywood',
	price: {
		3: [{length: {min: 0, max: 100}, price: 24}, {length: {min: 100, max: 500}, price: 16}],
		4: [{length: {min: 0, max: 100}, price: 29}, {length: {min: 100, max: 500}, price: 19}]
	}
}, {
	name: 'Оргстекло',
	code: 'plywood',
	price: {
		3: [{length: {min: 0, max: 100}, price: 24}, {length: {min: 100, max: 500}, price: 16}],
		4: [{length: {min: 0, max: 100}, price: 29}, {length: {min: 100, max: 500}, price: 19}]
	}
}, {
	name: 'МДФ (ДВП)',
	code: 'fibreboard',
	price: {
		3: [{length: {min: 0, max: 100}, price: 24}, {length: {min: 100, max: 500}, price: 16}],
		4: [{length: {min: 0, max: 100}, price: 29}, {length: {min: 100, max: 500}, price: 19}]
	}
}, {
	name: 'Массив дерева',
	code: 'solid-wood',
	price: {
		3: [{length: {min: 0, max: 100}, price: 24}, {length: {min: 100, max: 500}, price: 16}],
		4: [{length: {min: 0, max: 100}, price: 29}, {length: {min: 100, max: 500}, price: 19}]
	}
}, {
	name: 'Картон',
	code: 'cardboard',
	price: {
		3: [{length: {min: 0, max: 100}, price: 24}, {length: {min: 100, max: 500}, price: 16}],
		4: [{length: {min: 0, max: 100}, price: 29}, {length: {min: 100, max: 500}, price: 19}]
	}
}];

/**
 * Расчет цены реза.
 * @param length Длина реза, мм.
 * @param thickness Толщина материала.
 * @param material Тип материала.
 */
export function calculatePrice(length, thickness, material) {
	const materialData = materialTable.find(materialData => materialData.code === material);
	if (!materialData) throw new Error(`Не найден материал '${material}'`);

	const priceTable = materialData.price[thickness];
	if (!priceTable) throw new Error(`Не найдена толщина ${thickness} для материала ${material}`);

	const item = materialData.price[thickness].find(item => item.length.min >= length && length < item.length.max);
	if (!item) throw new Error(`Не найдена цена реза длиной ${length} мм для материала ${material} (${thickness} мм)`);

	return {
		value: item.price * (length / 100),
		unit: 'руб.'
	};
}

/**
 * Получить массив материалов с их данными.
 */
export function getMaterialTable() {
	return materialTable;
}