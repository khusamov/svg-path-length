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
	};
	time?: {
		seconds: number;
	};
}

export interface ICalculationResultProps {
	results: IResult[];
	activeIndex: number;
	status: 'idle' | 'request' | 'failure';
	emptyText: string;
}

export default class CalculationResult extends Component<ICalculationResultProps> {
	render() {
		const {results, activeIndex, status, emptyText} = this.props;
		if (!results.length) {
			return (
				<section className="stage stage--empty">
					<p>{emptyText}</p>
				</section>
			);
		}

		const active = results[Math.min(activeIndex, results.length - 1)];
		const summary = summarize(results);
		const several = results.length > 1;

		return (
			<section className="stage">
				{status === 'request' && <div className="stage__pending">Считаем длину, время и цену…</div>}
				{status === 'failure' && (
					<div className="stage__pending stage__pending--bad">Не удалось посчитать. См. консоль браузера.</div>
				)}
				<div className="stage__bar">
					<strong className="stage__name">{active.fileName}</strong>
					<span className={active.responseSuccess ? 'tag tag--ok' : 'tag tag--bad'}>
						{active.responseSuccess ? 'ОК' : 'Failure'}
					</span>
					<span className={active.resultHasErrors ? 'tag tag--warn' : 'tag tag--ok'}>
						{active.resultHasErrors ? 'Есть ошибки, см. консоль браузера' : 'Без ошибок'}
					</span>
				</div>
				<div className="stage__preview" dangerouslySetInnerHTML={{__html: active.fileAsSvgText}}/>
				<div className="readout">
					{several && (
						<div className="readout__item">
							<span className="readout__label">Итого, длина</span>
							<strong className="readout__value">
								{summary.totalLength === undefined ? '—' : formatNumber(summary.totalLength)}
								{summary.lengthUnit && <small>{summary.lengthUnit}</small>}
							</strong>
						</div>
					)}
					{several && (
						<div className="readout__item">
							<span className="readout__label">Итого, время</span>
							<strong className="readout__value readout__value--time">
								{summary.totalTime === undefined ? '—' : formatDuration(summary.totalTime)}
							</strong>
						</div>
					)}
					{several && (
						<div className="readout__item">
							<span className="readout__label">Итого, цена</span>
							<strong className="readout__value">
								{summary.totalPrice === undefined ? '—' : formatNumber(summary.totalPrice)}
								{summary.priceUnit && <small>{summary.priceUnit}</small>}
							</strong>
						</div>
					)}
					<div className="readout__item">
						<span className="readout__label">{several ? 'Этот файл, длина' : 'Длина линий'}</span>
						<strong className="readout__value">
							{formatNumber(Math.round(active.length.value))}
							{active.length.unit && <small>{active.length.unit}</small>}
						</strong>
					</div>
					<div className="readout__item">
						<span className="readout__label">{several ? 'Этот файл, время' : 'Время реза'}</span>
						<strong className="readout__value readout__value--time">
							{active.time ? formatDuration(active.time.seconds) : '—'}
						</strong>
					</div>
					<div className="readout__item">
						<span className="readout__label">{several ? 'Этот файл, цена' : 'Цена реза'}</span>
						<strong className="readout__value">
							{active.price.unit
								? <>{formatNumber(active.price.value)} <small>{active.price.unit}</small></>
								: '—'}
						</strong>
					</div>
				</div>
			</section>
		);
	}
}

export function formatNumber(value: number): string {
	return value.toLocaleString('ru-RU', {maximumFractionDigits: 2});
}

export function lengthLabel(length: {value: number; unit: string | undefined}): string {
	return `${formatNumber(Math.round(length.value))}${length.unit ? ` ${length.unit}` : ''}`;
}

export function priceLabel(price: {value: number; unit: string | undefined}): string {
	if (!price.unit) return '—';
	return `${formatNumber(price.value)} ${price.unit}`;
}

export function cuttingSeconds(lengthMm: number, speedMmPerMin: number): number {
	return lengthMm / speedMmPerMin * 60;
}

export function formatDuration(seconds: number): string {
	const total = Math.max(0, Math.round(seconds));
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const rest = total % 60;
	if (hours > 0) return minutes ? `${hours} ч ${minutes} мин` : `${hours} ч`;
	if (minutes > 0) return rest ? `${minutes} мин ${rest} с` : `${minutes} мин`;
	return `${rest} с`;
}

export function timeLabel(time: {seconds: number} | undefined): string {
	if (!time) return '—';
	return formatDuration(time.seconds);
}

function summarize(results: IResult[]) {
	const sameLength = results.every(result => result.length.unit === results[0].length.unit);
	const samePrice = results.every(result => !!result.price.unit && result.price.unit === results[0].price.unit);
	const sameTime = results.every(result => !!result.time);
	return {
		totalLength: sameLength ? results.reduce((sum, result) => sum + Math.round(result.length.value), 0) : undefined,
		lengthUnit: sameLength ? results[0].length.unit : undefined,
		totalTime: sameTime ? results.reduce((sum, result) => sum + (result.time ? result.time.seconds : 0), 0) : undefined,
		totalPrice: samePrice ? results.reduce((sum, result) => sum + result.price.value, 0) : undefined,
		priceUnit: samePrice ? results[0].price.unit : undefined
	};
}
