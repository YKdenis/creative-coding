const canvasSketch = require('canvas-sketch');
const {
	math: { degToRad },
	random: { range },
} = require('canvas-sketch-util');

const settings = {
	dimensions: [1080, 1080],
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
	return ({ context, width, height }) => {
		context.fillStyle = '#2a9d8f';
		context.fillRect(0, 0, width, height);

		context.fillStyle = '#fff';

		const cx = width * 0.5;
		const cy = height * 0.5;
		let x, y;

		const w = 0.01 * width;
		const h = 0.1 * height;

		const num = 10000;
		const radOfEachSlice = degToRad(360 / num);
		const radius = width * 0.4;

		for (i = 0; i < num; i++) {
			let angle = radOfEachSlice * i;
			// context.fillStyle = colors[Math.floor(range(0, 4.99))];
			context.fillStyle = createGrd(context, '#f4a261', '#2a9d8f');

			x = cx + radius * Math.sin(angle);
			y = cy + radius * Math.cos(angle);

			// clock *******
			context.save();
			context.translate(x, y);
			context.rotate(-angle);
			context.scale(range(0.2, 0.3), range(0.2, 0.5));

			context.beginPath();
			context.rect(-w * 0.5, -h * range(0.2, 9), w, h);
			context.fill();
			context.restore();

			// arc *******
			context.save();
			context.translate(cx, cy);
			context.rotate(-angle);
			context.lineWidth = range(20, 30);

			context.beginPath();
			context.arc(
				0,
				0,
				radius * range(0.4, 1),
				radOfEachSlice * range(0, -2),
				radOfEachSlice * range(1, 2)
			);
			context.strokeStyle = createGrd(context, '#e9c46a', '#f4a261');
			context.stroke();
			context.restore();
		}
	};
};

canvasSketch(sketch, settings);
