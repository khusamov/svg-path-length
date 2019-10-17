import ServiceModel from './ServiceModel';
import {ITotalLengthCalculationResult} from 'svg-path-length-library';

export interface IRequestLengthResult {
	result: ITotalLengthCalculationResult;
	success: boolean;
}

export default class LengthMethodModel {
	static async requestLength(svgFile: File): Promise<IRequestLengthResult> {
		const formData = new FormData();
		formData.append('svg-file-content', svgFile);
		const response = await ServiceModel.post('length', {body: formData});
		return {...await response.json(), success: response.ok};
	}
}