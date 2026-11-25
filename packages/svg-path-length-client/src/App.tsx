import React, {Component} from 'react';
import './App.scss';
import Calculator from './components/Calculator';
import packageJson from '../package.json';

export default class App extends Component {
	render() {
		return (
			<div className="app">
				<header className="titlebar">
					<svg className="titlebar__mark" viewBox="0 0 16 16" aria-hidden="true">
						<rect width="16" height="16" fill="#c4491d"/>
						<path
							d="M3 11c2.2-4.2 3.4-4.2 5-1.2S10.2 12.2 13 7"
							fill="none"
							stroke="#fff"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
					</svg>
					<h1>Калькулятор лазерного реза</h1>
					<p className="titlebar__meta">
						<span className="titlebar__name">{packageJson.name}</span>
						<span>{packageJson.version}</span>
					</p>
				</header>
				<Calculator/>
			</div>
		);
	}
}
