import React, {ChangeEvent, Component} from 'react';
import readAsText from '../readAsText';
import previewSvg from '../previewSvg';
import CalculationResult, {cuttingSeconds, IResult, lengthLabel, priceLabel, timeLabel} from '../CalculationResult/CalculationResult';
import SampleGallery from '../SampleGallery/SampleGallery';
import {ISampleFile} from '../../samples/catalog';
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
	activeIndex: number;
	galleryOpen: boolean;
}

export default class Calculator extends Component<{}, ICalculatorState> {
	state: ICalculatorState = {
		status: 'idle',
		materials: [],
		activeIndex: 0,
		galleryOpen: true
	};

	constructor(props: {}) {
		super(props);
		this.loadMaterials();
	}

	render() {
		const {selectedFiles, requests, status, materials, selectedMaterial, selectedThickness, activeIndex} = this.state;

		const speed = selectedMaterial && selectedMaterial.speed && selectedThickness
			? selectedMaterial.speed[selectedThickness]
			: undefined;
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
				time: speed ? {seconds: cuttingSeconds(request.response.result.totalLength.value, speed)} : undefined,
				price: request.price ? request.price : {
					unit: '',
					value: 0
				}
			}))
		);

		const thicknesses: number[] = [];
		if (selectedMaterial) {
			for (const thickness in selectedMaterial.price) {
				if (!selectedMaterial.price.hasOwnProperty(thickness)) continue;
				thicknesses.push(Number(thickness));
			}
		}

		const busy = status === 'request';
		const hasFiles = !!(selectedFiles && selectedFiles.length);
		const currentIndex = results.length ? Math.min(activeIndex, results.length - 1) : 0;
		const emptyText = status === 'failure'
			? 'Не удалось посчитать. См. консоль браузера.'
			: status === 'request'
				? 'Считаем длину, время и цену…'
				: !hasFiles
					? 'Откройте SVG или CDR'
					: !selectedMaterial
						? 'Выберите материал'
						: !selectedThickness
							? 'Выберите толщину'
							: 'Считаем длину, время и цену…';

		return (
			<div className="workspace">
				<aside className="sidebar">
					<div className="sidebar__controls">
						<div className="actions">
							<label className={`btn btn--primary${busy ? ' is-disabled' : ''}`}>
								<input
									className="file-input"
									type="file"
									multiple={true}
									accept=".svg,.cdr,image/svg+xml"
									disabled={busy}
									onChange={this.onInputFileChange}
								/>
								Открыть
							</label>
							<button
								className="btn"
								type="button"
								disabled={busy}
								onClick={() => this.setState({galleryOpen: true})}
							>
								Примеры
							</button>
						</div>
						<div className="fields">
							<label className="field">
								<span className="field__label">Материал</span>
								{!materials.length ? (
									<select className="field__control" disabled value="">
										<option value="">Загрузка…</option>
									</select>
								) : (
									<MaterialSelect materials={materials} onChange={this.onMaterialSelectChange}/>
								)}
							</label>
							<label className="field">
								<span className="field__label">Толщина</span>
								<select
									className="field__control"
									value={selectedMaterial && selectedThickness ? String(selectedThickness) : ''}
									disabled={!selectedMaterial}
									onChange={this.onThicknessSelectChange}
									aria-label="Толщина материала"
								>
									<option value="">{selectedMaterial ? 'Не выбрано' : '—'}</option>
									{thicknesses.map((thickness, index) => (
										<option key={index} value={thickness}>{thickness} мм</option>
									))}
								</select>
							</label>
						</div>
					</div>
					<div className="sidebar__files">
						{results.length ? results.map((result, index) => (
							<button
								type="button"
								className={index === currentIndex ? 'file is-active' : 'file'}
								key={`${result.fileName}-${index}`}
								onClick={() => this.setState({activeIndex: index, galleryOpen: false})}
							>
								<span className="file__thumb" dangerouslySetInnerHTML={{__html: result.fileAsSvgText}}/>
								<span className="file__ext">{fileExtension(result.fileName)}</span>
								<span className="file__body">
									<span className="file__name">{result.fileName}</span>
									<span className="file__meta">{lengthLabel(result.length)} · {timeLabel(result.time)} · {priceLabel(result.price)}</span>
								</span>
							</button>
						)) : selectedFiles && selectedFiles.length > 0 ? selectedFiles.map((selectedFile, index) => (
							<div className="file" key={`${selectedFile.name}-${index}`}>
								<span className="file__ext">{fileExtension(selectedFile.name)}</span>
								<span className="file__body">
									<span className="file__name">{selectedFile.name}</span>
									<span className="file__meta">{formatFileSize(selectedFile.size)}</span>
								</span>
							</div>
						)) : (
							<p className="files-empty">Файлы не выбраны</p>
						)}
					</div>
				</aside>
				{this.state.galleryOpen ? (
					<SampleGallery
						onSelect={this.onSampleSelect}
						onClose={results.length || hasFiles ? () => this.setState({galleryOpen: false}) : undefined}
					/>
				) : (
					<CalculationResult
						results={results}
						activeIndex={currentIndex}
						status={status}
						emptyText={emptyText}
					/>
				)}
			</div>
		);
	}

	private onSampleSelect = (sample: ISampleFile) => {
		this.selectSampleFile(sample.file, sample.fileName, 'image/svg+xml');
	};

	private selectSampleFile = async (url: string, fileName: string, type: string) => {
		try {
			const response = await fetch(`${process.env.PUBLIC_URL}${url}`);
			if (!response.ok) throw new Error(`Не удалось загрузить тестовый файл: ${response.status}`);
			const blob = await response.blob();
			const file = new File([blob], fileName, {type});
			this.setState({selectedFiles: [file], galleryOpen: false}, () => this.calculate());
		} catch (error) {
			console.error(error);
			this.setState({status: 'failure'});
		}
	};

	private onInputFileChange = async (event: ChangeEvent) => {
		const inputFileElement = event.currentTarget as HTMLInputElement;
		const fileList = inputFileElement.files;
		if (fileList && fileList.length) {
			const selectedFiles = Array.from(fileList);
			this.setState({selectedFiles, galleryOpen: false});
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
							async selectFile => {
								const response = await LengthMethodModel.requestLength(selectFile);
								if (!response.success || !response.result) {
									throw new Error(`Не удалось рассчитать файл ${selectFile.name}`);
								}
								const sourceText = isCdrFile(selectFile)
									? response.result.sourceSvg.svgText
									: await readAsText(selectFile);
								return {
									file: selectFile,
									fileAsText: previewSvg(sourceText),
									response
								};
							}
						)
					)
				);
				console.log(
					'Расчет файлов:',
					selectedFiles.map(selectedFile => selectedFile.name).join(', '),
					requests
				);
				this.setState({requests, status: 'idle', activeIndex: 0});
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
			this.setState({requests: [], activeIndex: 0});
		}
	}
}

function isCdrFile(file: File): boolean {
	return /\.cdr$/i.test(file.name);
}

function fileExtension(fileName: string): string {
	const match = /\.([a-z0-9]+)$/i.exec(fileName);
	return match ? match[1] : 'file';
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} Б`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}