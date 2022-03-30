const canvasSketch = require('canvas-sketch');
const {
	math: { degToRad, mapRange },
	random: { range },
} = require('canvas-sketch-util');

const settings = {
	dimensions: [2048, 2048],
	// encoding: 'image/jpeg',
};

const createInverseGrd = (context, color0, color1) => {
	const grd = context.createLinearGradient(
		range(0, 100),
		range(0, 100),
		range(-200, -800),
		range(-100, -300)
	);
	grd.addColorStop(0, color0);
	grd.addColorStop(1, color1);
	return grd;
};

const createGrd = (context, color0, color1) => {
	const grd = context.createLinearGradient(500, 100, 100, 500);
	grd.addColorStop(0, color0);
	grd.addColorStop(1, color1);
	return grd;
};

const sketch = ({ context, width, height }) => {
	const cubeWidth = 50;
	const num = 128;
	const rootNum = Math.pow(num, 1 / 2);
	const ix = width / 2 - cubeWidth * 0.5;
	const iy = height / 2 - rootNum * cubeWidth * -0.4;

	const cubes = [];

	for (i = 0; i < rootNum; i++) {
		for (j = 0; j < rootNum; j++) {
			cubes.push(
				new Cube(
					ix - cubeWidth * j + cubeWidth * i,
					iy + cubeWidth * 0.5 * j + cubeWidth * 0.5 * i,
					cubeWidth,
					range(300, 1000)
				)
			);
		}
	}

	return ({ context, width, height }) => {
		context.fillStyle = '#e7feff';

		context.fillRect(0, 0, width, height);

		cubes.map((cube) => cube.draw(context));
	};
};

class Face {
	constructor(type, ix, iy, w, h) {
		this.type = type;
		this.ix = ix;
		this.iy = iy;
		this.w = w;
		this.h = h;
	}

	draw(context) {
		context.save();
		context.translate(this.ix, this.iy);
		switch (this.type) {
			case 'right':
				context.fillStyle = createInverseGrd(context, '#318ce7', '#ace5ee');
				context.transform(1, 0.5, 0, 1, 0, 0);
				context.fillRect(0, 0, -this.w, -this.h);
				break;
			case 'left':
				context.fillStyle = createInverseGrd(context, '#ace5ee', '#fff');
				context.transform(1, -0.5, 0, 1, this.w, -this.w * 0.5);
				context.fillRect(0, 0, -this.w, -this.h);
				break;
			case 'center':
				context.fillStyle = createGrd(context, '#000', '#000');
				context.translate(-this.w, -this.h - this.w * 0.5);
				context.rotate(degToRad(135));
				context.scale(1.06, 1.06);
				context.transform(1, 0.333, 0.333, 1, 0, 0);

				context.fillRect(0, 0, -this.w, -this.w);
				break;
		}
		context.restore();

		// context.save();
		// context.arc(0, 0, 20, 0, 2 * Math.PI);
		// context.stroke();
	}
}

class Cube {
	constructor(ix, iy, w, h) {
		this.ix = ix;
		this.iy = iy;
		this.w = w;
		this.h = h;
	}

	draw(context) {
		const faces = ['center', 'left', 'right'];

		faces.map((face) => {
			const newFace = new Face(face, this.ix, this.iy, this.w, this.h);

			newFace.draw(context);
		});
	}
}

canvasSketch(sketch, settings);
