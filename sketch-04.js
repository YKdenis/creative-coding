const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const tweakpane = require('tweakpane');

const settings = {
	dimensions: [1080, 1080],
	animate: true,
};

const params = {
	cols: 10,
	rows: 10,
	speed: 2,
	frequency: 0.005,
	scale: 30,
	amplitude: 1,
	animate: true,
	frame: 0,
	lineCap: 'butt',
};

const sketch = () => {
	return ({ context, width, height, frame }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		const numCells = params.cols * params.rows;

		const gridWidth = width * 0.8;
		const gridHeight = height * 0.8;

		const cellWidth = gridWidth / params.cols;
		const cellHeight = gridHeight / params.rows;

		const marginX = (width - gridWidth) / 2;
		const marginY = (height - gridHeight) / 2;

		for (i = 0; i < numCells; i++) {
			const col = i % params.cols;
			const row = Math.floor(i / params.cols);

			const x = col * cellWidth;
			const y = row * cellHeight;
			const w = cellWidth * 0.8;
			const h = cellHeight * 0.8;

			const f = params.animate ? frame : params.frame;

			// const n = random.noise2D(
			// 	x + frame * params.speed,
			// 	y,
			// 	params.frequency,
			// );
			const n = random.noise3D(x, y, f * params.speed, params.frequency);
			const angle = n * Math.PI * params.amplitude;
			const scale = ((n + 1) / 2) * params.scale;

			context.save();

			context.translate(x, y);
			context.translate(marginX, marginY);
			context.translate(cellWidth * 0.5, cellHeight * 0.5);
			context.rotate(angle);

			context.lineWidth = scale;
			context.lineCap = params.lineCap;

			context.beginPath();
			context.moveTo(w * -0.5, 0);
			context.lineTo(w * 0.5, 0);
			context.strokeStyle = '#f5cac3';
			context.stroke();

			context.restore();
		}
	};
};

const createPane = () => {
	const pane = new tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Grid' });
	folder.addInput(params, 'lineCap', {
		options: { butt: 'butt', round: 'round', square: 'square' },
	});
	folder.addInput(params, 'cols', { min: 2, max: 100, step: 1 });
	folder.addInput(params, 'rows', { min: 2, max: 100, step: 1 });
	folder.addInput(params, 'scale', { min: 1, max: 100 });

	folder = pane.addFolder({ title: 'Noise' });
	folder.addInput(params, 'animate');
	folder.addInput(params, 'speed', { min: 1, max: 20, step: 1 });
	folder.addInput(params, 'frequency', { min: -0.01, max: 0.01 });
	folder.addInput(params, 'amplitude', { min: 0, max: 1 });
	folder.addInput(params, 'frame', { min: 0, max: 999 });
};

createPane();
canvasSketch(sketch, settings);
