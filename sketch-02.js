const canvasSketch = require('canvas-sketch');
const {
	math: { degToRad },
	random: { range, noise2D },
} = require('canvas-sketch-util');
const tweakpane = require('tweakpane');

const settings = {
	dimensions: [1080, 1080],
	animate: true,
};

const params = {
	num: 3000,
	minLineWidth: 20,
	maxLineWidth: 30,
	radius: 0.2,
	scaleX: -1,
	scaleY: 1,
	speed: 1,
	frame: 0,
	animate: true,
	frequency: 0.01,
};

const createGrd = (context, color0, color1) => {
	const grd = context.createLinearGradient(0, 0, 10, 20);
	grd.addColorStop(0, color0);
	grd.addColorStop(1, color1);
	return grd;
};

const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

// const degToRad = (deg) => (deg / 180) * Math.PI;

// const randomRange = (min, max) => Math.random() * (max - min) + min;

const sketch = () => {
	return ({ context, width, height, frame }) => {
		context.fillStyle = '#2a9d8f';
		context.fillRect(0, 0, width, height);

		context.fillStyle = '#fff';

		const cx = width * 0.5;
		const cy = height * 0.5;
		let x, y;

		const w = 0.01 * width;
		const h = 0.1 * height;

		const radOfEachSlice = degToRad(360 / params.num);
		const radius = width * params.radius;

		for (i = 0; i < params.num; i++) {
			let angle = radOfEachSlice * i;
			// context.fillStyle = colors[Math.floor(range(0, 4.99))];
			context.fillStyle = createGrd(context, '#f4a261', '#2a9d8f');

			x = cx + radius * Math.sin(angle);
			y = cy + radius * Math.cos(angle);

			// clock *******
			context.save();
			context.translate(x, y);
			context.rotate(-angle);

			const n = noise2D(x + frame * params.speed, y, params.frequency);

			context.scale(params.scaleX, params.scaleY);

			context.beginPath();
			context.rect(-w * 0.5, -h * n, w, h);
			context.strokeStyle = 'black';
			context.stroke();
			context.restore();

			// arc *******
			context.save();
			context.translate(cx, cy);
			context.rotate(-angle);
			context.lineWidth = range(params.minLineWidth, params.maxLineWidth);

			context.beginPath();
			context.arc(0, 0, radius, radOfEachSlice, radOfEachSlice);
			context.strokeStyle = createGrd(context, '#e9c46a', '#f4a261');
			context.stroke();
			context.restore();
		}
	};
};

const createPane = () => {
	const pane = new tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Animation' });
	folder.addInput(params, 'animate');
	folder.addInput(params, 'frame', { min: 0, max: 999 });
	folder.addInput(params, 'speed', { min: 0, max: 20 });
	folder.addInput(params, 'frequency', { min: -0.01, max: 0.01 });

	folder = pane.addFolder({ title: 'Cirlce' });
	folder.addInput(params, 'num', { min: 1, max: 20000 });
	folder.addInput(params, 'radius', { min: 0, max: 1 });

	folder = pane.addFolder({ title: 'Particle' });
	folder.addInput(params, 'minLineWidth', { min: 1, max: 50 });
	folder.addInput(params, 'maxLineWidth', { min: 1, max: 50 });
	folder.addInput(params, 'scaleX', { min: -1, max: 1 });
	folder.addInput(params, 'scaleY', { min: -1, max: 1 });
};

createPane();
canvasSketch(sketch, settings);
