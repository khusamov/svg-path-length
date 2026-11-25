import React, {Component} from 'react';
import {ISampleFile, sampleFiles} from '../../samples/catalog';

interface ISampleGalleryProps {
	onSelect: (sample: ISampleFile) => void;
	onClose?: () => void;
}

export default class SampleGallery extends Component<ISampleGalleryProps> {
	render() {
		const {onSelect, onClose} = this.props;
		return (
			<section className="gallery">
				<header className="gallery__head">
					<h2>Примеры резки</h2>
					<p>{sampleFiles.length} листов разных форматов</p>
					{onClose && (
						<button className="btn" type="button" onClick={onClose}>К чертежу</button>
					)}
				</header>
				<div className="gallery__grid">
					{sampleFiles.map(sample => (
						<button
							className="gallery__card"
							type="button"
							key={sample.id}
							onClick={() => onSelect(sample)}
						>
							<span className="gallery__thumb">
								<img src={`${process.env.PUBLIC_URL}${sample.file}`} alt=""/>
							</span>
							<span className="gallery__title">{sample.title}</span>
							<span className="gallery__meta">{sample.kind} · {sample.sheet}</span>
						</button>
					))}
				</div>
			</section>
		);
	}
}
