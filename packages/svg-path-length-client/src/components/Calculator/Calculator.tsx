import React, {ChangeEvent, Component} from 'react';
import readAsText from '../readAsText';
import previewSvg from '../previewSvg';
import ShortGuide from '../ShortGuide';
import CalculationResult, {IResult} from '../CalculationResult/CalculationResult';
import LengthMethodModel, {IRequestLengthResult} from '../../models/LengthMethodModel';
import MaterialSelect from '../MaterialSelect';
import {IMaterialTableItem} from 'svg-path-length-service';
import MaterialModel from '../../models/MaterialModel';
import CalculatePriceMethodModel from '../../models/CalculatePriceMethodModel';
import {ServiceError} from '../../models/ServiceModel';

interface IRequestItem {
	file: File;
	fileAsText: string;
	response: IRequestLengthResult;
	price?: {
		value: number;
		unit: string;
	}
}

interface ICalculatorState {
	selectedFiles?: File[];
	selectedMaterial?: IMaterialTableItem;
	selectedThickness?: number;
	materials: IMaterialTableItem[];
	status: 'idle' | 'request' | 'failure';
	requests?: IRequestItem[];
}

export default class Calculator extends Component<{}, ICalculatorState> {
	state: ICalculatorState = {
		status: 'idle',
		materials: []
	};

	constructor(props: {}) {
		super(props);
		this.loadMaterials();
	}

	render() {
		const {selectedFiles, requests, status, materials, selectedMaterial, selectedThickness} = this.state;

		const results: IResult[] = (
			(requests || []).map<IResult>(request => ({
				fileName: request.file.name,
				fileAsSvgText: request.fileAsText,
				responseSuccess: request.response.success,
				resultHasErrors: request.response.result.hasErrors,
				length: {
					unit: request.response.result.totalLength.unit,
					value: request.response.result.totalLength.value
				},
				price: request.price ? request.price : {
					unit: '',
					value: 0
				}
			}))
		);

		return (
			<div className='Calculator'>
				<div>Калькулятор расчета длины линий SVG-файла</div>
				<div style={{marginBottom: 20}}>
					<div>
						<input
							type='file'
							multiple={true}
							accept='image/svg+xml'
							disabled={status === 'request'}
							onChange={this.onInputFileChange}
						/>
					</div>
					<div>
						<span>Выберите материал: </span>
						{!materials.length ? '[Материалы загружаются...]' : (
							<MaterialSelect materials={materials} onChange={this.onMaterialSelectChange}/>
						)}
					</div>
					<div>
						<span>Выберите толщину материала: </span>
						{selectedMaterial && (
							<select value={selectedThickness} onChange={this.onThicknessSelectChange}>
								<option>Не выбрано</option>
								{(function() {
									const result: number[] = [];
									for (const thickness in selectedMaterial.price) {
										if (!selectedMaterial.price.hasOwnProperty(thickness)) continue;
										result.push(Number(thickness));
									}
									return (
										result.map((thickness, index) => <option key={index} value={thickness}>{thickness} мм</option>)
									);
								})()}
							</select>
						)}
					</div>
					{selectedFiles && selectedFiles.length && (
						<div>Выбраны файлы: {selectedFiles.map(selectedFile => selectedFile.name).join(', ')}</div>
					)}
					<div>
						{
							{
								idle: <span style={{color: 'blue'}}>Выберите SVG-файлы для расчета.</span>,
								request: <span style={{color: 'green'}}>Файлы отправлены на сервер. Ждите ответ...</span>,
								failure: <span style={{color: 'red'}}>Внимание, что-то пошло не так! См. консоль браузера.</span>,
							}[status]
						}
					</div>
				</div>

				{!!results.length && <CalculationResult results={results}/>}
				<ShortGuide/>
			</div>
		);
	}

	private onInputFileChange = async (event: ChangeEvent) => {
		const inputFileElement = event.currentTarget as HTMLInputElement;
		const fileList = inputFileElement.files;
		if (fileList && fileList.length) {
			const selectedFiles = Array.from(fileList);
			this.setState({selectedFiles});
		}
		this.calculate();
	};

	private async requestLength() {
		const {selectedFiles} = this.state;
		if (selectedFiles && selectedFiles.length) {
			this.setState({status: 'request'});
			try {
				const requests = (
					await Promise.all(
						selectedFiles.map(
							async selectFile => ({
								file: selectFile,
								fileAsText: previewSvg(await readAsText(selectFile)),
								response: await LengthMethodModel.requestLength(selectFile)
							})
						)
					)
				);
				console.log(
					'Расчет файлов:',
					selectedFiles.map(selectedFile => selectedFile.name).join(', '),
					requests
				);
				this.setState({requests, status: 'idle'});
				this.requestCalculatePrice();
			} catch (error) {
				console.error(error);
				this.setState({status: 'failure'});
			}
		}
	}

	private async requestCalculatePrice() {
		const {requests, selectedMaterial, selectedThickness} = this.state;
		if (requests && selectedMaterial && selectedThickness !== undefined) {

			let calculatePriceResult;
			try {
				calculatePriceResult = (
					await Promise.all(
						requests.map(request => (
							CalculatePriceMethodModel.requestCalculatePrice({
								thickness: selectedThickness,
								material: selectedMaterial,
								length: request.response.result.totalLength.value
							})
						))
					)
				);
			} catch (error) {
				if (error instanceof ServiceError) {
					console.error(error);
					this.setState({
						status: 'failure'
					})
				} else {
					throw error;
				}
			}

			if (calculatePriceResult) {
				this.setState({
					requests: (
						calculatePriceResult.map((item, index) => ({
							...requests[index],
							price: item.result.price
						}))
					)
				});
			}
		}
	}

	private onThicknessSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		this.setState({selectedThickness: Number(event.target.value)}, () => this.calculate());
	};

	private onMaterialSelectChange = (selectedMaterial?: IMaterialTableItem) => {
		this.setState({selectedMaterial, selectedThickness: 0}, () => this.calculate());
	};

	private async loadMaterials() {
		const materials = await MaterialModel.load();
		this.setState({materials});
	}

	private async calculate() {
		const {selectedMaterial, selectedThickness, selectedFiles} = this.state;
		if (selectedMaterial && selectedThickness !== undefined && selectedThickness !== 0 && selectedFiles && !!selectedFiles.length) {
			await this.requestLength();
		} else {
			this.setState({requests: []});
		}
	}
}