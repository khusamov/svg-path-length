import Svgo from 'svgo';

/**
 * Подготовка SVG-файла к вычислениям.
 * 1) Все примитивы превращаются в path-элементы (но опцией convertArcs можно отключать это преобразование для окружностей, эллипсов и дуг).
 * 2) Все path-элементы сливаются в один path.
 * 3) Удаляются style и script разделы.
 * 4) Сокращаются path-данные и применяются все трансформации.
 * @param svgText
 * @param convertArcs
 */
export default async function optimize(svgText, {convertArcs}) {
	const svgo = new Svgo({
		plugins: [{
			convertShapeToPath: {
				convertArcs
			}
		}, {
			mergePaths: false
		}, {
			removeStyleElement: true
		}, {
			removeScriptElement: true
		}, {
			// https://github.com/svg/svgo/blob/master/plugins/convertPathData.js
			convertPathData: {
				// Похоже проблема
				// https://github.com/svg/svgo/issues/1151
				// решается этой опцией:
				noSpaceAfterFlags: false
			}
		}]
	});

	return (await svgo.optimize(svgText)).data;
}