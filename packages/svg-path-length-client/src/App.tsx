import React, {Component, CSSProperties} from 'react';
import './App.scss';
import Calculator from './components/Calculator';
import packageJson from '../package.json';

export default class App extends Component {
	render() {
		const footerStyle: CSSProperties = {
			position: 'fixed',
			bottom: 0,
			left: 0,
			padding: '8px 15px',
			backgroundColor: 'silver',
			fontSize: '80%'
		};
		return (
			<div className="App">
				<Calculator/>
				<div style={footerStyle}>
					{packageJson.name}, версия клиента {packageJson.version}
				</div>
			</div>
		);
	}
};
