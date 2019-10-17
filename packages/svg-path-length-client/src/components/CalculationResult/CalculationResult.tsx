import React, {Component} from 'react';

export interface IResult {
	fileName: string;
	fileAsSvgText: string;
	responseSuccess: boolean;
	resultHasErrors: boolean;
	length: {
		value: number;
		unit: string | undefined;
	};
	price: {
		value: number;
		unit: string | undefined;
	}
}

export interface ICalculationResultProps {
	results: IResult[]
}

export default class CalculationResult extends Component<ICalculationResultProps> {
	render() {
		const {results} = this.props;
		return (
			<div>
				<table>
					<caption>Результаты расчета ({results.length}):</caption>
					<thead>
						<tr>
							<th>№</th>
							<th>Файл</th>
							<th>Превью</th>
							<th>Результат запроса</th>
							<th>Длина линий</th>
							<th>Единица измерения</th>
							<th>Результат вычислений</th>
							<th>Цена реза, руб.</th>
						</tr>
					</thead>
					<tbody>
						{
							results.map((result, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{result.fileName}</td>
									<td dangerouslySetInnerHTML={{__html: result.fileAsSvgText}}/>
									<td>{result.responseSuccess ? 'ОК' : 'Failure'}</td>
									<td>{Math.round(result.length.value)}</td>
									<td>{result.length.unit}</td>
									<td>{result.resultHasErrors ? 'Есть ошибки, см. консоль браузера' : 'Без ошибок'}</td>
									<td>{result.price.value} {result.price.unit}</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>
		);
	}
}