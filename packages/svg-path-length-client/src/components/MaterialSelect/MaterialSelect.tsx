import React, {ChangeEvent, Component} from 'react';
import {IMaterialTableItem} from 'svg-path-length-service';

interface IMaterialSelectProps {
	materials: IMaterialTableItem[];
	onChange: (material?: IMaterialTableItem) => void
}

export default class MaterialSelect extends Component<IMaterialSelectProps> {
	render() {
		const {materials} = this.props;
		return (
			<select onChange={this.onSelectChange}>
				<option>Не выбрано</option>
				{
					materials.map((material, index) => (
						<option key={index} value={material.code}>
							{material.name}
						</option>
					))
				}
			</select>
		);
	}

	private onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const {materials, onChange} = this.props;
		const selectedMaterial = materials.find(material => material.code === event.target.value);
		onChange(selectedMaterial);
	};
}