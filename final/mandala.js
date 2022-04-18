const canvasSketch = require('canvas-sketch');
const {
	math: { degToRad },
	random,
} = require('canvas-sketch-util');
const tweakpane = require('tweakpane');

const settings = {
	dimensions: [2048, 2048],
	animate: true,
};

const params = {
	num: 12,
	radius: 2,
	smallCircle: 0.6,
	speed: 10,
	amplitude: 0.5,
	frequency: 0.005,
};

let manager;

const sketch = ({ context, width, height }) => {
	return ({ context, width, height, frame }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		const cx = width * 0.5;
		const cy = height * 0.5;
		let x, y;
		const n = random.noise3D(
			frame,
			frame,
			params.speed,
			params.frequency,
			params.amplitude
		);
		params.num = Math.floor(Math.abs(n) * 100);
		// params.smallCircle = Math.abs(n * 0.5);

		const radOfEachSlice = degToRad(360 / params.num);
		const radius = width * params.radius;

		// Big circle
		context.save();
		context.translate(width / 2, height / 2);

		context.beginPath();
		context.arc(0, 0, radius, 0, Math.PI * 2);

		context.restore();

		// Small circle
		context.save();
		context.translate(width / 2, height / 2);

		context.beginPath();
		context.arc(0, 0, radius * params.smallCircle, 0, Math.PI * 2);
		context.fillStyle = '#ca6702';
		context.lineWidth = 5;

		// context.fill();
		context.stroke();
		context.restore();

		for (i = 0; i < params.num; i++) {
			let angleBigCircle = radOfEachSlice * i;
			context.fillStyle = 'black';

			x = cx + radius * Math.sin(angleBigCircle) * n;
			y = cy + radius * Math.cos(angleBigCircle) * n;

			// orbs placed on the circle. Distance in rad. Amount = num *******
			context.save();
			context.translate(x, y);

			context.beginPath();
			context.arc(0, 0, radius * 0.005 * Math.abs(n), 0, Math.PI * 2);
			context.fillStyle = '#ee9b00';
			context.fill();
			context.restore();

			for (j = 0; j < params.num; j++) {
				let angleSmallCircle = radOfEachSlice * j;
				let ox = cx + radius * params.smallCircle * Math.sin(angleSmallCircle);
				let oy = cy + radius * params.smallCircle * Math.cos(angleSmallCircle);

				context.save();
				context.beginPath();
				context.moveTo(x, y);
				context.quadraticCurveTo(x, y, ox, oy);
				context.strokeStyle = '#ee9b00';

				context.stroke();
				context.restore();
			}
		}
	};
};

const onKeyUp = (e) => {
	e.key == 'r' && manager.render();
	e.key == 'p' && manager.togglePlay();
};
document.addEventListener('keyup', onKeyUp);

const createPane = () => {
	const pane = new tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Dashoard' });
	folder.addInput(params, 'num', { min: 1, max: 200, step: 1 });
	folder.addInput(params, 'radius', { min: 0, max: 5 });
	folder.addInput(params, 'smallCircle', { min: 0, max: 5 });
};

createPane();
canvasSketch(sketch, settings).then((res) => (manager = res));
