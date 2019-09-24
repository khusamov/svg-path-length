import React, {ChangeEvent, Component} from 'react';
import {ITotalLengthCalculationResult} from 'svg-path-length-library';

interface IRequestLengthResult {
	result: ITotalLengthCalculationResult;
	success: boolean;
}

interface ICalculatorState {
	selectedFiles?: File[];
	status: 'idle' | 'request' | 'failure';
	requests?: Array<{
		file: File;
		response: IRequestLengthResult;
	}>;
}

export default class Calculator extends Component<{}, ICalculatorState> {
	private static async requestLength(svgFile: File): Promise<IRequestLengthResult> {
		const formData = new FormData();
		formData.append('svg-file-content', svgFile);
		const response = (
			await fetch(`http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/length`, {
				method: 'post',
				body: formData
			})
		);
		return await response.json();

	}

	state: ICalculatorState = {
		status: 'idle'
	};

	render() {
		const {selectedFiles, requests, status} = this.state;
		return (
			<div className='Calculator'>
				<div>
					<input
						type='file'
						multiple={true}
						accept='image/svg+xml'
						disabled={status === 'request'}
						onChange={this.onInputFileChange}
					/>
				</div>
				{selectedFiles && selectedFiles.length && (
					<div>Выбраны файлы: {selectedFiles.map(selectedFile => selectedFile.name).join(', ')}</div>
				)}
				{
					{
						idle: 'Выберите SVG-файлы для расчета.',
						request: 'Файлы отправлены на сервер. Ждите ответ...',
						failure: 'Внимание, что-то пошло не так! См. консоль браузера.',
					}[status]
				}
				{requests && (
					<div>
						<table>
							<caption>Результаты расчета ({requests.length}):</caption>
							<thead>
								<tr>
									<th>№</th>
									<th>Файл</th>
									<th>Результат запроса</th>
									<th>Длина линий</th>
									<th>Единица измерения</th>
									<th>Результат вычислений</th>
								</tr>
							</thead>
							<tbody>
								{
									requests.map((request, index) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>{request.file.name}</td>
											<td>{request.response.success ? 'ОК' : 'Failure'}</td>
											<td>{Math.round(request.response.result.totalLength.value)}</td>
											<td>{request.response.result.totalLength.unit}</td>
											<td>{request.response.result.hasErrors ? 'Есть ошибки, см. консоль браузера' : 'Без ошибок'}</td>
										</tr>
									))
								}
							</tbody>
						</table>
					</div>
				)}
			</div>
		);
	}

	private onInputFileChange = async (event: ChangeEvent) => {
		const inputFileElement = event.currentTarget as HTMLInputElement;
		const fileList = inputFileElement.files;
		if (fileList && fileList.length) {
			const selectedFiles = Array.from(fileList);
			this.setState({selectedFiles, status: 'request'});
			try {
				const requests = (
					await Promise.all(
						selectedFiles.map(
							async selectFile => ({
								file: selectFile,
								response: await Calculator.requestLength(selectFile)
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
			} catch (error) {
				console.error(error);
				this.setState({status: 'failure'});
			}
		}
	};
}