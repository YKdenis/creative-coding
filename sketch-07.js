const canvasSketch = require('canvas-sketch');
const { math, random } = require('canvas-sketch-util');
const tweakpane = require('tweakpane');

const settings = {
	dimensions: [1048, 1048],
	animate: true,
};

let manager;

const params = {
	num: 4,
	w: 50,
};

const sketch = () => {
	return ({ context, width, height, frame }) => {
		context.fillStyle = '#571089';
		context.fillRect(0, 0, width, height);

		const x = width / 2;
		const y = height / 2;

		for (i = params.num; i > 0; i--) {
			createSquare(context, x, y, params.w, i, (Math.PI / 2) * i, frame);
			createGlass(context, x, y, params.w * i, (Math.PI / 2) * i, frame);
		}
	};
};

const createPane = () => {
	const pane = new tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Dashoard' });
	folder.addInput(params, 'num', { min: 1, max: 200, step: 1 });
};

const createGlass = (context, x, y, w, angle, frame) => {
	const n = random.noise2D(x + frame * 5, y - frame * 5, 0.005);

	context.save();

	context.translate(x - n * 5, y - n * 5);
	context.rotate(angle);
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(0, -w);
	context.lineTo(w, 0);
	context.moveTo(0, 0);
	context.lineTo(0, w);
	context.lineTo(-w, 0);
	context.fillStyle = '#ea698b';
	context.fill();

	context.restore();
	context.save();

	context.translate(x, y);
	context.rotate(angle);
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(0, -w);
	context.lineTo(-w, 0);
	context.moveTo(0, 0);
	context.lineTo(0, w);
	context.lineTo(w, 0);
	context.fillStyle = '#c05299';
	context.fill();

	context.restore();
};

createSquare = (context, cx, cy, w, i, angle, frame) => {
	const cubes = Math.pow(i * 2, 2);
	const cols = Math.pow(cubes, 0.5);

	const gridWidth = w * cols;

	for (j = 0; j < cubes; j++) {
		const col = j % cols;
		const row = Math.floor(j / cols);

		const x = col * w;
		const y = row * w;
		const n = random.noise2D(x + frame * 5, y - frame * 5, 0.005);

		context.save();

		context.translate(cx - gridWidth / 2, cy - gridWidth / 2);
		// context.rotate(angle);

		context.beginPath();
		context.rect(x + n * 5, y + n * 5, w, w);
		(row % 2 === 0 && j % 2 === 0) || (row % 2 !== 0 && j % 2 !== 0)
			? (context.fillStyle = '#973aa8')
			: (context.fillStyle = '#6d23b6');
		context.fill();
		context.restore();
	}
};

const onKeyUp = (e) => {
	e.key == 'r' && manager.render();
	e.key == 'p' && manager.togglePlay();
};
document.addEventListener('keyup', onKeyUp);

createPane();
canvasSketch(sketch, settings).then((res) => (manager = res));
