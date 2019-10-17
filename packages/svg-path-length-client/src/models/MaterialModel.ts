import ServiceModel from './ServiceModel';
import {IMaterialTableItem as IMaterial, IPriceByThickness} from 'svg-path-length-service';

export default class MaterialModel implements IMaterial {
	/**
	 * Загружает все материалы.
	 */
	static async load(): Promise<MaterialModel[]> {
		const materials: IMaterial[] = await ServiceModel.getJson('materials');
		return materials.map(material => new MaterialModel(material));
	}

	readonly code: string;
	readonly name: string;
	readonly price: IPriceByThickness;

	/**
	 * Перечень толщин, которые можно заказывать для данного материала.
	 */
	get thicknessList(): number[] {
		const result: number[] = [];
		for (const thickness in this.price) {
			if (!this.price.hasOwnProperty(thickness)) continue;
			result.push(Number(thickness));
		}
		return result;
	}

	constructor({code, name, price}: IMaterial) {
		this.code = code;
		this.name = name;
		this.price = price;
	}
}