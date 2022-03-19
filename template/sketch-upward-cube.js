const canvasSketch = require('canvas-sketch');
const {
	math: { degToRad, mapRange },
	random: { range },
} = require('canvas-sketch-util');

const settings = {
	dimensions: [2048, 2048],
};

const sketch = ({ context, width, height }) => {
	const cube = new Cube(400, 800, 100, 600);

	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		cube.draw(context);
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
				context.fillStyle = 'lightblue';
				context.transform(1, 0.5, 0, 1, 0, 0);
				context.fillRect(0, 0, -this.w, -this.h);
				break;
			case 'left':
				context.fillStyle = 'blue';
				context.transform(1, -0.5, 0, 1, this.w, -this.w * 0.5);
				context.fillRect(0, 0, -this.w, -this.h);
				break;
			case 'center':
				context.fillStyle = 'darkblue';
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
