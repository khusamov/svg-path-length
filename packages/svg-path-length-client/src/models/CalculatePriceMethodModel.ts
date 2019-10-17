import ServiceModel from './ServiceModel';
import {IMaterialTableItem} from 'svg-path-length-service';

export interface IRequestCalculatePriceResult {
	request: any;
	result: {
		price: {
			value: number;
			unit: string;
		};
	};
}

export interface IRequestCalculatePriceParams {
	material: IMaterialTableItem;
	thickness: number;
	length?: number;
	svgFile?: File;
}

export default class CalculatePriceMethodModel {
	static async requestCalculatePrice({length, material, svgFile, thickness}: IRequestCalculatePriceParams): Promise<IRequestCalculatePriceResult> {
		const formData = new FormData();

		formData.append('material', material.code);
		formData.append('thickness', String(thickness));
		if (length !== undefined) formData.append('length', String(length));
		if (svgFile) formData.append('svg-file-content', svgFile);

		return await ServiceModel.postJson('calculate-price', {body: formData});
	}
}