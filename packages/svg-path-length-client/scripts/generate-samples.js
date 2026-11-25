const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/samples');
const catalogPath = path.join(__dirname, '../src/samples/catalog.ts');

const fmt = (n) => {
	const value = Math.round(n * 100) / 100;
	return Object.is(value, -0) ? 0 : value;
};

const polar = (cx, cy, r, deg) => {
	const a = deg * Math.PI / 180;
	return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

const pts = (points) => points.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(' L ');

const linePath = (points) => `<path d="M ${pts(points)}"/>`;

const closedPath = (points) => `<path d="M ${pts(points)} Z"/>`;

const pathD = (d) => `<path d="${d}"/>`;

const circle = (cx, cy, r) => `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}"/>`;

const ellipse = (cx, cy, rx, ry) => `<ellipse cx="${fmt(cx)}" cy="${fmt(cy)}" rx="${fmt(rx)}" ry="${fmt(ry)}"/>`;

const frame = (w, h, m) => pathD(`M ${fmt(m)} ${fmt(m)} H ${fmt(w - m)} V ${fmt(h - m)} H ${fmt(m)} Z`);

const star = (cx, cy, outer, inner, count, rotate) => {
	const points = [];
	for (let i = 0; i < count * 2; i++) {
		const radius = i % 2 === 0 ? outer : inner;
		const angle = (rotate || -90) + i * (180 / count);
		points.push(polar(cx, cy, radius, angle));
	}
	return closedPath(points);
};

const svgDoc = (w, h, body) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}" fill="none" stroke="#1c1917" stroke-width="0.45" stroke-linejoin="round" stroke-linecap="round">
${body}
</svg>
`;

const samples = [
	{
		id: '01-lotus',
		title: 'Лотос',
		kind: 'Мандала',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			const parts = [circle(cx, cy, 78), circle(cx, cy, 18), circle(cx, cy, 8)];
			for (let i = 0; i < 12; i++) {
				const angle = i * 30;
				const [x1, y1] = polar(cx, cy, 24, angle - 14);
				const [x2, y2] = polar(cx, cy, 68, angle);
				const [x3, y3] = polar(cx, cy, 24, angle + 14);
				const [c1x, c1y] = polar(cx, cy, 58, angle - 16);
				const [c2x, c2y] = polar(cx, cy, 58, angle + 16);
				parts.push(pathD(`M ${fmt(x1)} ${fmt(y1)} C ${fmt(c1x)} ${fmt(c1y)} ${fmt(x2)} ${fmt(y2)} ${fmt(x2)} ${fmt(y2)} C ${fmt(x2)} ${fmt(y2)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(x3)} ${fmt(y3)}`));
			}
			for (let i = 0; i < 12; i++) {
				const [x, y] = polar(cx, cy, 28, i * 30);
				parts.push(circle(x, y, 2.2));
			}
			return parts.join('\n');
		}
	},
	{
		id: '02-hex-lattice',
		title: 'Соты',
		kind: 'Решётка',
		sheet: 'Альбом 200×140 мм',
		w: 200,
		h: 140,
		draw: (w, h) => {
			const r = 11;
			const dx = r * 1.5;
			const dy = r * Math.sqrt(3);
			const parts = [frame(w, h, 4)];
			for (let row = 0, y = 16; y < h - 8; row++, y += dy) {
				const offset = row % 2 ? dx : 0;
				for (let x = 16 + offset; x < w - 10; x += dx * 2) {
					const points = [];
					for (let i = 0; i < 6; i++) points.push(polar(x, y, r - 0.4, -90 + i * 60));
					parts.push(closedPath(points));
				}
			}
			return parts.join('\n');
		}
	},
	{
		id: '03-waves',
		title: 'Волны',
		kind: 'Фриз',
		sheet: 'Фриз 240×80 мм',
		w: 240,
		h: 80,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			for (let row = 0; row < 5; row++) {
				const y = 16 + row * 12;
				const amplitude = 4.5;
				const points = [];
				for (let x = 8; x <= w - 8; x += 3) {
					points.push([x, y + Math.sin((x / 14) + row) * amplitude]);
				}
				parts.push(linePath(points));
			}
			return parts.join('\n');
		}
	},
	{
		id: '04-tree',
		title: 'Древо',
		kind: 'Панно',
		sheet: 'Портрет 140×200 мм',
		w: 140,
		h: 200,
		draw: (w, h) => {
			const parts = [frame(w, h, 5)];
			const segments = [];
			const grow = (x, y, angle, len, depth) => {
				if (depth === 0 || len < 6) return;
				const x2 = x + Math.cos(angle) * len;
				const y2 = y + Math.sin(angle) * len;
				segments.push([ [x, y], [x2, y2] ]);
				grow(x2, y2, angle - 0.42, len * 0.68, depth - 1);
				grow(x2, y2, angle + 0.48, len * 0.72, depth - 1);
			};
			grow(w / 2, h - 16, -Math.PI / 2, 48, 7);
			segments.forEach((segment) => parts.push(linePath(segment)));
			parts.push(circle(w / 2, h - 16, 2.5));
			return parts.join('\n');
		}
	},
	{
		id: '05-snowflake',
		title: 'Снежинка',
		kind: 'Мандала',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			const parts = [circle(cx, cy, 74), circle(cx, cy, 10)];
			for (let arm = 0; arm < 6; arm++) {
				const angle = arm * 60;
				const points = [
					polar(cx, cy, 14, angle),
					polar(cx, cy, 68, angle)
				];
				parts.push(linePath(points));
				[28, 42, 56].forEach((radius, index) => {
					const [x, y] = polar(cx, cy, radius, angle);
					const spread = 18 + index * 4;
					const len = 8 + index * 3;
					parts.push(linePath([
						polar(x, y, 0, 0),
						polar(x, y, len, angle - 90 - spread)
					].map((point, i) => i === 0 ? [x, y] : point)));
					parts.push(linePath([
						[x, y],
						polar(x, y, len, angle - 90 + spread)
					]));
				});
			}
			return parts.join('\n');
		}
	},
	{
		id: '06-star',
		title: 'Звезда',
		kind: 'Геометрия',
		sheet: 'Квадрат 160×160 мм',
		w: 160,
		h: 160,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			return [
				star(cx, cy, 68, 28, 8, -90),
				star(cx, cy, 36, 16, 8, -90),
				circle(cx, cy, 8)
			].join('\n');
		}
	},
	{
		id: '07-diamonds',
		title: 'Ромбы',
		kind: 'Решётка',
		sheet: 'Альбом 200×140 мм',
		w: 200,
		h: 140,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			const step = 16;
			for (let y = 12; y < h - 8; y += step) {
				for (let x = 12; x < w - 8; x += step) {
					parts.push(closedPath([
						[x + step / 2, y + 2],
						[x + step - 2, y + step / 2],
						[x + step / 2, y + step - 2],
						[x + 2, y + step / 2]
					]));
				}
			}
			return parts.join('\n');
		}
	},
	{
		id: '08-scales',
		title: 'Чешуя',
		kind: 'Орнамент',
		sheet: 'Альбом 180×120 мм',
		w: 180,
		h: 120,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			const stepX = 16;
			const stepY = 12;
			for (let row = 0, y = 14; y < h - 8; row++, y += stepY) {
				const shift = row % 2 ? stepX / 2 : 0;
				for (let x = 8 + shift; x < w - 12; x += stepX) {
					parts.push(pathD(`M ${fmt(x)} ${fmt(y)} Q ${fmt(x + stepX / 2)} ${fmt(y + 14)} ${fmt(x + stepX)} ${fmt(y)}`));
				}
			}
			return parts.join('\n');
		}
	},
	{
		id: '09-feather',
		title: 'Перо',
		kind: 'Панно',
		sheet: 'Закладка 70×200 мм',
		w: 70,
		h: 200,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			const cx = w / 2;
			parts.push(pathD(`M ${fmt(cx)} 16 L ${fmt(cx)} 184`));
			for (let i = 0; i < 18; i++) {
				const y = 28 + i * 8.2;
				const len = 18 * Math.sin((i / 17) * Math.PI);
				const tilt = 10 + i * 0.4;
				parts.push(linePath([[cx, y], [cx - len, y + tilt]]));
				parts.push(linePath([[cx, y], [cx + len, y + tilt]]));
			}
			return parts.join('\n');
		}
	},
	{
		id: '10-rings',
		title: 'Кружево',
		kind: 'Орнамент',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const parts = [frame(w, h, 5)];
			for (let y = 28; y <= h - 28; y += 28) {
				for (let x = 28; x <= w - 28; x += 28) {
					parts.push(circle(x, y, 12));
					parts.push(circle(x, y, 4));
				}
			}
			return parts.join('\n');
		}
	},
	{
		id: '11-fan',
		title: 'Веер',
		kind: 'Ар-деко',
		sheet: 'Альбом 200×120 мм',
		w: 200,
		h: 120,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h - 8;
			const parts = [frame(w, h, 4)];
			for (let radius = 20; radius <= 96; radius += 12) {
				const [x1, y1] = polar(cx, cy, radius, 200);
				const [x2, y2] = polar(cx, cy, radius, 340);
				parts.push(pathD(`M ${fmt(x1)} ${fmt(y1)} A ${fmt(radius)} ${fmt(radius)} 0 0 1 ${fmt(x2)} ${fmt(y2)}`));
			}
			for (let angle = 200; angle <= 340; angle += 10) {
				parts.push(linePath([polar(cx, cy, 18, angle), polar(cx, cy, 96, angle)]));
			}
			return parts.join('\n');
		}
	},
	{
		id: '12-meander',
		title: 'Меандр',
		kind: 'Фриз',
		sheet: 'Фриз 240×70 мм',
		w: 240,
		h: 70,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			const y1 = 18;
			const y2 = 52;
			let x = 12;
			const d = ['M ' + fmt(x) + ' ' + fmt(y2)];
			while (x < w - 18) {
				d.push(`L ${fmt(x)} ${fmt(y1)}`);
				d.push(`L ${fmt(x + 10)} ${fmt(y1)}`);
				d.push(`L ${fmt(x + 10)} ${fmt(y2)}`);
				d.push(`L ${fmt(x + 20)} ${fmt(y2)}`);
				x += 20;
			}
			parts.push(pathD(d.join(' ')));
			return parts.join('\n');
		}
	},
	{
		id: '13-mountains',
		title: 'Горы',
		kind: 'Панно',
		sheet: 'Альбом 220×110 мм',
		w: 220,
		h: 110,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			const ridges = [
				[8, 78, 36, 28, 64, 74, 98, 22, 132, 70, 168, 30, 212, 76],
				[8, 88, 48, 48, 90, 84, 140, 40, 180, 82, 212, 60]
			];
			ridges.forEach((ridge) => {
				const points = [];
				for (let i = 0; i < ridge.length; i += 2) points.push([ridge[i], ridge[i + 1]]);
				parts.push(linePath(points));
			});
			parts.push(circle(176, 24, 8));
			return parts.join('\n');
		}
	},
	{
		id: '14-rose',
		title: 'Роза',
		kind: 'Панно',
		sheet: 'Квадрат 160×160 мм',
		w: 160,
		h: 160,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			const points = [];
			for (let t = 0; t <= Math.PI * 7.2; t += 0.07) {
				const radius = 3 + t * 6.4;
				points.push([cx + Math.cos(t) * radius, cy + Math.sin(t) * radius]);
			}
			return [circle(cx, cy, 72), linePath(points), circle(cx, cy, 3)].join('\n');
		}
	},
	{
		id: '15-squares',
		title: 'Квадраты',
		kind: 'Решётка',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const parts = [frame(w, h, 5)];
			const step = 20;
			for (let y = 15; y < h - 14; y += step) {
				for (let x = 15; x < w - 14; x += step) {
					parts.push(pathD(`M ${fmt(x)} ${fmt(y)} H ${fmt(x + step - 4)} V ${fmt(y + step - 4)} H ${fmt(x)} Z`));
					parts.push(pathD(`M ${fmt(x)} ${fmt(y)} L ${fmt(x + step - 4)} ${fmt(y + step - 4)}`));
				}
			}
			return parts.join('\n');
		}
	},
	{
		id: '16-spiral',
		title: 'Спираль',
		kind: 'Панно',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			const points = [];
			for (let t = 0; t <= Math.PI * 10; t += 0.08) {
				const radius = 4 + t * 4.6;
				points.push([cx + Math.cos(t) * radius, cy + Math.sin(t) * radius]);
			}
			return [circle(cx, cy, 78), linePath(points)].join('\n');
		}
	},
	{
		id: '17-leaf',
		title: 'Лист',
		kind: 'Панно',
		sheet: 'Портрет 120×180 мм',
		w: 120,
		h: 180,
		draw: (w, h) => {
			const cx = w / 2;
			const parts = [
				frame(w, h, 5),
				pathD(`M ${fmt(cx)} 20 C ${fmt(cx + 46)} 50 ${fmt(cx + 40)} 120 ${fmt(cx)} 160 C ${fmt(cx - 40)} 120 ${fmt(cx - 46)} 50 ${fmt(cx)} 20 Z`),
				pathD(`M ${fmt(cx)} 28 L ${fmt(cx)} 154`)
			];
			for (let i = 0; i < 7; i++) {
				const y = 42 + i * 15;
				const len = 16 + Math.sin((i / 6) * Math.PI) * 18;
				parts.push(pathD(`M ${fmt(cx)} ${fmt(y)} Q ${fmt(cx + len)} ${fmt(y + 6)} ${fmt(cx + len + 6)} ${fmt(y + 14)}`));
				parts.push(pathD(`M ${fmt(cx)} ${fmt(y)} Q ${fmt(cx - len)} ${fmt(y + 6)} ${fmt(cx - len - 6)} ${fmt(y + 14)}`));
			}
			return parts.join('\n');
		}
	},
	{
		id: '18-sun',
		title: 'Солнце',
		kind: 'Мандала',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			const parts = [circle(cx, cy, 28), circle(cx, cy, 18), circle(cx, cy, 74)];
			for (let angle = 0; angle < 360; angle += 12) {
				parts.push(linePath([polar(cx, cy, 34, angle), polar(cx, cy, 66, angle)]));
			}
			return parts.join('\n');
		}
	},
	{
		id: '19-wave-lattice',
		title: 'Волнистая решётка',
		kind: 'Решётка',
		sheet: 'Альбом 200×140 мм',
		w: 200,
		h: 140,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			for (let y = 14; y <= h - 14; y += 12) {
				const points = [];
				for (let x = 8; x <= w - 8; x += 4) points.push([x, y + Math.sin(x / 10) * 3]);
				parts.push(linePath(points));
			}
			for (let x = 14; x <= w - 14; x += 12) {
				const points = [];
				for (let y = 8; y <= h - 8; y += 4) points.push([x + Math.sin(y / 10) * 3, y]);
				parts.push(linePath(points));
			}
			return parts.join('\n');
		}
	},
	{
		id: '20-butterfly',
		title: 'Бабочка',
		kind: 'Панно',
		sheet: 'Альбом 200×140 мм',
		w: 200,
		h: 140,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2 + 4;
			const wing = (sign) => pathD(
				`M ${fmt(cx)} ${fmt(cy)} ` +
				`C ${fmt(cx + sign * 30)} ${fmt(cy - 50)} ${fmt(cx + sign * 78)} ${fmt(cy - 36)} ${fmt(cx + sign * 70)} ${fmt(cy - 4)} ` +
				`C ${fmt(cx + sign * 62)} ${fmt(cy + 16)} ${fmt(cx + sign * 28)} ${fmt(cy + 10)} ${fmt(cx)} ${fmt(cy)} ` +
				`C ${fmt(cx + sign * 24)} ${fmt(cy + 18)} ${fmt(cx + sign * 62)} ${fmt(cy + 28)} ${fmt(cx + sign * 48)} ${fmt(cy + 46)} ` +
				`C ${fmt(cx + sign * 30)} ${fmt(cy + 58)} ${fmt(cx + sign * 12)} ${fmt(cy + 24)} ${fmt(cx)} ${fmt(cy)}`
			);
			return [
				frame(w, h, 5),
				wing(1),
				wing(-1),
				pathD(`M ${fmt(cx)} ${fmt(cy - 18)} L ${fmt(cx)} ${fmt(cy + 28)}`),
				circle(cx - 3, cy - 22, 1.6),
				circle(cx + 3, cy - 22, 1.6),
				ellipse(cx - 28, cy - 8, 10, 16),
				ellipse(cx + 28, cy - 8, 10, 16)
			].join('\n');
		}
	},
	{
		id: '21-skyline',
		title: 'Город',
		kind: 'Фриз',
		sheet: 'Фриз 240×100 мм',
		w: 240,
		h: 100,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			const buildings = [18, 42, 28, 56, 24, 48, 70, 36, 52, 22, 40, 64, 30];
			let x = 10;
			const base = 86;
			buildings.forEach((height) => {
				const width = 16;
				parts.push(pathD(`M ${fmt(x)} ${fmt(base)} V ${fmt(base - height)} H ${fmt(x + width - 2)} V ${fmt(base)}`));
				for (let wy = base - height + 6; wy < base - 4; wy += 7) {
					parts.push(pathD(`M ${fmt(x + 4)} ${fmt(wy)} H ${fmt(x + 8)}`));
				}
				x += width;
			});
			return parts.join('\n');
		}
	},
	{
		id: '22-guilloche',
		title: 'Гильош',
		kind: 'Орнамент',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			const R = 46;
			const r = 14;
			const d = 22;
			const points = [];
			const turns = (R - r) / r;
			for (let t = 0; t <= Math.PI * 2 * turns; t += 0.04) {
				points.push([
					cx + (R - r) * Math.cos(t) + d * Math.cos(turns * t),
					cy + (R - r) * Math.sin(t) - d * Math.sin(turns * t)
				]);
			}
			return [circle(cx, cy, 74), circle(cx, cy, 18), linePath(points)].join('\n');
		}
	},
	{
		id: '23-triangles',
		title: 'Треугольники',
		kind: 'Решётка',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const parts = [frame(w, h, 5)];
			const step = 22;
			for (let y = 14; y < h - 16; y += step) {
				for (let x = 14; x < w - 16; x += step) {
					parts.push(closedPath([[x, y + step - 2], [x + step / 2, y + 2], [x + step - 2, y + step - 2]]));
				}
			}
			return parts.join('\n');
		}
	},
	{
		id: '24-moon',
		title: 'Луна',
		kind: 'Панно',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const parts = [frame(w, h, 5), circle(58, 70, 28)];
			parts.push(pathD('M 70 48 A 28 28 0 1 0 70 96'));
			[[130, 36, 8], [150, 62, 5], [118, 88, 4], [146, 112, 6], [124, 132, 3.5]].forEach(([x, y, r]) => {
				parts.push(star(x, y, r, r * 0.42, 5, -90));
			});
			return parts.join('\n');
		}
	},
	{
		id: '25-braid',
		title: 'Косичка',
		kind: 'Фриз',
		sheet: 'Фриз 240×60 мм',
		w: 240,
		h: 60,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			for (let phase = 0; phase < 3; phase++) {
				const points = [];
				for (let x = 10; x <= w - 10; x += 3) {
					const y = h / 2 + Math.sin((x / 16) + phase * 2.1) * 12;
					points.push([x, y]);
				}
				parts.push(linePath(points));
			}
			return parts.join('\n');
		}
	},
	{
		id: '26-hex-mandala',
		title: 'Шестигранник',
		kind: 'Мандала',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			const parts = [circle(cx, cy, 12)];
			[24, 40, 56, 72].forEach((radius) => {
				const points = [];
				for (let i = 0; i < 6; i++) points.push(polar(cx, cy, radius, -90 + i * 60));
				parts.push(closedPath(points));
			});
			for (let i = 0; i < 6; i++) {
				parts.push(linePath([polar(cx, cy, 12, -90 + i * 60), polar(cx, cy, 72, -90 + i * 60)]));
			}
			return parts.join('\n');
		}
	},
	{
		id: '27-fern',
		title: 'Папоротник',
		kind: 'Панно',
		sheet: 'Закладка 90×200 мм',
		w: 90,
		h: 200,
		draw: (w, h) => {
			const parts = [frame(w, h, 4)];
			const cx = w / 2;
			parts.push(pathD(`M ${fmt(cx)} 184 L ${fmt(cx)} 24`));
			for (let i = 0; i < 14; i++) {
				const y = 170 - i * 10;
				const len = 8 + (1 - Math.abs(i - 7) / 7) * 22;
				const droop = 8;
				parts.push(pathD(`M ${fmt(cx)} ${fmt(y)} Q ${fmt(cx - len * 0.6)} ${fmt(y - 2)} ${fmt(cx - len)} ${fmt(y + droop)}`));
				parts.push(pathD(`M ${fmt(cx)} ${fmt(y)} Q ${fmt(cx + len * 0.6)} ${fmt(y - 2)} ${fmt(cx + len)} ${fmt(y + droop)}`));
			}
			return parts.join('\n');
		}
	},
	{
		id: '28-corner-frame',
		title: 'Угловой орнамент',
		kind: 'Рамка',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const parts = [frame(w, h, 8), frame(w, h, 16)];
			const corner = (x, y, sx, sy) => {
				const bits = [];
				for (let i = 0; i < 4; i++) {
					const o = 22 + i * 7;
					bits.push(pathD(`M ${fmt(x + sx * o)} ${fmt(y)} L ${fmt(x)} ${fmt(y + sy * o)}`));
				}
				bits.push(circle(x + sx * 28, y + sy * 28, 3));
				return bits.join('\n');
			};
			parts.push(corner(16, 16, 1, 1));
			parts.push(corner(w - 16, 16, -1, 1));
			parts.push(corner(16, h - 16, 1, -1));
			parts.push(corner(w - 16, h - 16, -1, -1));
			parts.push(circle(w / 2, h / 2, 10));
			return parts.join('\n');
		}
	},
	{
		id: '29-ribbons',
		title: 'Ленты',
		kind: 'Орнамент',
		sheet: 'Альбом 200×140 мм',
		w: 200,
		h: 140,
		draw: (w, h) => {
			const parts = [frame(w, h, 5)];
			for (let band = 0; band < 4; band++) {
				const y = 28 + band * 24;
				parts.push(pathD(
					`M 12 ${fmt(y)} C 50 ${fmt(y - 16)} 80 ${fmt(y + 16)} 110 ${fmt(y)} S 170 ${fmt(y - 16)} 188 ${fmt(y)}`
				));
			}
			return parts.join('\n');
		}
	},
	{
		id: '30-ellipses',
		title: 'Эллипсы',
		kind: 'Розетка',
		sheet: 'Квадрат 180×180 мм',
		w: 180,
		h: 180,
		draw: (w, h) => {
			const cx = w / 2;
			const cy = h / 2;
			const parts = [circle(cx, cy, 74), circle(cx, cy, 8)];
			for (let i = 0; i < 8; i++) {
				const angle = i * 45;
				parts.push(
					`<ellipse cx="${fmt(cx)}" cy="${fmt(cy)}" rx="58" ry="16" transform="rotate(${angle} ${fmt(cx)} ${fmt(cy)})"/>`
				);
			}
			return parts.join('\n');
		}
	}
];

fs.mkdirSync(outDir, {recursive: true});
fs.mkdirSync(path.dirname(catalogPath), {recursive: true});

const catalog = samples.map((sample) => {
	const fileName = `${sample.id}.svg`;
	fs.writeFileSync(path.join(outDir, fileName), svgDoc(sample.w, sample.h, sample.draw(sample.w, sample.h)));
	return {
		id: sample.id,
		title: sample.title,
		kind: sample.kind,
		sheet: sample.sheet,
		fileName,
		file: `/samples/${fileName}`
	};
});

const catalogSource = `export interface ISampleFile {
	id: string;
	title: string;
	kind: string;
	sheet: string;
	fileName: string;
	file: string;
}

export const sampleFiles: ISampleFile[] = ${JSON.stringify(catalog, null, '\t')};
`;

fs.writeFileSync(catalogPath, catalogSource);
console.log(`Wrote ${catalog.length} samples to ${outDir}`);
