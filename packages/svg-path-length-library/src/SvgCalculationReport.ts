import {ITotalLengthCalculationResult} from './SvgLengthCalculator';

export default class SvgCalculationReport {
	private log: string[];

	constructor(private totalLengthCalculationResult: ITotalLengthCalculationResult) {}

	toString() {
		this.createReport(this.totalLengthCalculationResult);
		return this.log.join('\n');
	}

	/**
	 * Отчет в расширенном виде в формате JSON.
	 */
	toJson(): any {
		interface IAnyObject {[key: string]: any;}
		const report: IAnyObject = {};
		report.results = this.totalLengthCalculationResult.results;
		report.total = this.withUnit(this.totalLengthCalculationResult.totalLength);
		report.sourceSvg = this.totalLengthCalculationResult.sourceSvgContainer.svgText;
		report.optimizedSvg = this.totalLengthCalculationResult.optimizedSvgContainer.svgText;
		report.errors = (
			this.totalLengthCalculationResult.results.reduce((errors: IAnyObject[], result) => {
				if (result.hasErrors) {
					errors.push({
						name: result.name,
						errors: result.parts.reduce((errors: IAnyObject[], part) => {
							if (part.error) {
								errors.push({
									error: part.error,
									markup: part.markup
								});
							}
							return errors;
						}, [])
					});
				}
				return errors;
			}, [])
		);
		return report;
	}

	private clear(): this {
		this.log = [];
		return this;
	}

	private add(text: string): this {
		this.log.push(text);
		return this;
	}

	private break(): this {
		this.log.push('');
		return this;
	}

	private withUnit(num: number): string {
		num = this.totalLengthCalculationResult.optimizedSvgContainer.convertCoord(num);
		num = Math.round(num);
		return `${num} ${this.totalLengthCalculationResult.optimizedSvgContainer.unit || ''}`;
	}

	private createReport(totalLengthCalculationResult: ITotalLengthCalculationResult) {
		this
			.clear().break()
			.add(totalLengthCalculationResult.sourceSvgContainer.svgText).break()
			.add(totalLengthCalculationResult.optimizedSvgContainer.svgText).break()
			.add('Calculation Results:');
		for (const result of totalLengthCalculationResult.results) {
			if (result.length) {
				this.add(`${result.name}: ${this.withUnit(result.length)} ${result.hasErrors ? 'has-errors' : ''}`);
			}
		}
		this.add(`Total: ${this.withUnit(totalLengthCalculationResult.totalLength)}`).break();
		this.createErrorReport(totalLengthCalculationResult);
	}

	private createErrorReport(totalLengthCalculationResult: ITotalLengthCalculationResult) {
		if (totalLengthCalculationResult.hasErrors) {
			this.add('Errors:').break();
			for (const result of totalLengthCalculationResult.results) {
				if (result.hasErrors) {
					this.add(result.name).break();
					for (const part of result.parts) {
						if (part.error) {
							this.add(part.markup);
							this.add(part.error.message);
							this.break();
						}
					}
					this.break();
				}
			}
			this.break();
		}
	}
}