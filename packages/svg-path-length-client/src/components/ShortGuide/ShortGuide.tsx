import React, {Component} from 'react';

export default class ShortGuide extends Component {
	render() {
		const text = `
			Опции при экспорте CDR -> SVG
			-----------------------------
	
			SVG 1.1
			UTF-8
			Document Setup: millimeters
			Drawing Precision: 1:100 units
			[+] Keep pixel measurements
			Export Text: As Curves
		`;

		// Убрать из текста лишние пробелы и табы.
		const __html = text.split('\n').map(s => s.trim()).join('\n');

		return <code><pre dangerouslySetInnerHTML={{__html}}/></code>;
	}
}