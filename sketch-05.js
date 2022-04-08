const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const tweakpane = require('tweakpane');
const settings = {
	dimensions: [1048, 1048],
	animate: true,
};

let manager;
let fontFamily = 'serif';

let params = {
	cell: 100,
	speed: 2,
	frequency: 0.005,
	amplitude: 0.5,
};

// const url = 'https://picsum.photos/id/152/3888/2592';
const url = 'assets/bw-face-woman.jpeg';

const loadImage = (url) => {
	return new Promise((res, rej) => {
		const image = new Image();
		image.onload = () => res(image);
		image.onerror = () => rej(image);
		image.crossOrigin = 'anonymous';
		image.src = url;
		settings.dimensions = [image.width, image.height];
	});
};
let img = '';

const sketch = ({ context, width, height }) => {
	return ({ context, width, height, frame }) => {
		const cols = Math.floor(width / params.cell);
		const rows = Math.floor(height / params.cell);
		const numCells = cols * rows;

		context.drawImage(img, 0, 0, width / params.cell, height / params.cell);

		const typeData = context.getImageData(0, 0, cols, rows).data;

		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		for (i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * params.cell;
			const y = row * params.cell;

			// Get the rgba values out of the typeData array.
			const r = typeData[i * 4 + 0];
			const g = typeData[i * 4 + 1];
			const b = typeData[i * 4 + 2];
			const a = typeData[i * 4 + 3];

			const n =
				b > 50
					? random.noise3D(
							x + frame,
							y + frame,
							params.speed,
							params.frequency,
							params.amplitude
					  ) * 1.2
					: 0;

			const angle = n * Math.PI * 0.2;

			// Create glyphs based on the red value of every pixel
			// const glyph = getGlyph(b);
			const glyph = '+';

			context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

			context.save();
			context.translate(x, y);
			context.translate(params.cell * 0.5 + n, params.cell * 0.5 + n);
			context.rotate(angle);

			context.font = `${params.cell * 2}px ${fontFamily}`;
			// if (Math.random() < 0.001) {
			// 	context.font = `${params.cell * 10}px ${fontFamily} `;
			// }
			// if (Math.random() < 0.005) {
			// 	context.font = `${params.cell * 4}px ${fontFamily}`;
			// }
			context.fillText(glyph, 0, 0);

			context.restore();
		}
	};
};

const getGlyph = (v) => {
	if (v < 50) return `=`;
	if (v < 100) return `*`;
	if (v < 150) return `"`;
	if (v < 200) return `+`;

	const glyphs = '= /!()><'.split('');

	// return random.pick(glyphs);
	return '/';
};

const onKeyUp = (e) => {
	e.key == 'r' && manager.render();
	e.key == 'p' && manager.togglePlay();
};

document.addEventListener('keyup', onKeyUp);

const createPane = () => {
	const pane = new tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Noise' });
	folder.addInput(params, 'cell', { min: 1, max: 40, step: 1 });
	folder.addInput(params, 'speed', { min: 1, max: 20, step: 1 });
	folder.addInput(params, 'frequency', { min: -0.01, max: 0.01 });
	folder.addInput(params, 'amplitude', { min: 0, max: 1 });
};

// createPane();

loadImage(url)
	.then((res) => {
		img = res;
		return canvasSketch(sketch, settings);
	})
	.then((res) => (manager = res));
