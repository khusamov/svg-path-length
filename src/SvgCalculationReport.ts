import {ITotalLengthCalculationResult} from './SvgLengthCalculator';

export default class SvgCalculationReport {
	private log: string[];

	constructor(totalLengthCalculationResult: ITotalLengthCalculationResult) {
		this.createReport(totalLengthCalculationResult);
	}

	toString() {
		return this.log.join('\n');
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

	private createReport(totalLengthCalculationResult: ITotalLengthCalculationResult) {
		const withUnit = num => `${num} ${totalLengthCalculationResult.optimizedSvgContainer.unit || ''}`;
		this
			.clear().break()
			.add(totalLengthCalculationResult.sourceSvgContainer.svgText).break()
			.add(totalLengthCalculationResult.optimizedSvgContainer.svgText).break()
			.add('Calculation Results:');
		for (const result of totalLengthCalculationResult.results) {
			if (result.length) {
				this.add(`${result.name}: ${withUnit(result.length)} ${result.hasErrors ? 'has-errors' : ''}`);
			}
		}
		this.add(`Total: ${withUnit(totalLengthCalculationResult.totalLength)}`).break();
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
							this.add(part.html);
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