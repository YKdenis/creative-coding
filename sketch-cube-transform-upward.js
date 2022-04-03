const canvasSketch = require('canvas-sketch');
const {
	math: { degToRad, mapRange },
	random: { range },
} = require('canvas-sketch-util');
const tweakpane = require('tweakpane');

const settings = {
	dimensions: [2048, 2048],
	// encoding: 'image/jpeg',
};

const params = {
	num: 128,
	cubeWidth: 50,
	primary: '#318ce7',
	secondary: '#ace5ee',
	tertiary: '#fff',
	quaternary: '#000',
	background: '#e5fffb',
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

const sketch = ({ context, width, height, render }) => {
	createPane(render);

	return ({ context, width, height }) => {
		const rootNum = Math.pow(params.num, 1 / 2);
		const ix = width / 2 - params.cubeWidth * 0.5;
		const iy = height / 2 - rootNum * params.cubeWidth * -0.4;
		const cubes = [];

		for (i = 0; i < rootNum; i++) {
			for (j = 0; j < rootNum; j++) {
				cubes.push(
					new Cube(
						ix - params.cubeWidth * j + params.cubeWidth * i,
						iy + params.cubeWidth * 0.5 * j + params.cubeWidth * 0.5 * i,
						params.cubeWidth,
						range(300, 1000)
					)
				);
			}
		}

		const gradients = cubes.map((cube) => ({
			right: createInverseGrd(context, params.primary, params.secondary),
			left: createInverseGrd(context, params.secondary, params.tertiary),
		}));
		context.fillStyle = params.background;

		context.fillRect(0, 0, width, height);

		cubes.map((cube, i) => cube.draw(context, gradients[i]));
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

	draw(context, gradient) {
		context.save();
		context.translate(this.ix, this.iy);
		switch (this.type) {
			case 'right':
				context.fillStyle = gradient.right;
				context.transform(1, 0.5, 0, 1, 0, 0);
				context.fillRect(0, 0, -this.w, -this.h);
				break;
			case 'left':
				context.fillStyle = gradient.left;
				context.transform(1, -0.5, 0, 1, this.w, -this.w * 0.5);
				context.fillRect(0, 0, -this.w, -this.h);
				break;
			case 'center':
				context.fillStyle = params.quaternary;
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

	draw(context, gradient) {
		const faces = ['center', 'left', 'right'];

		faces.map((face) => {
			const newFace = new Face(face, this.ix, this.iy, this.w, this.h);

			newFace.draw(context, gradient);
		});
	}
}

const createPane = (render) => {
	const pane = new tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Cubes' });
	folder.addInput(params, 'num', { min: 1, max: 1000, step: 1 });
	folder.addInput(params, 'cubeWidth', { min: 1, max: 200, step: 1 });

	folder = pane.addFolder({ title: 'Colors' });
	folder.addInput(params, 'primary');
	folder.addInput(params, 'secondary');
	folder.addInput(params, 'tertiary');
	folder.addInput(params, 'quaternary');
	folder.addInput(params, 'background');

	const btn = pane.addButton({
		title: 'Rerender',
	});

	btn.on('click', () => {
		render();
	});
};

canvasSketch(sketch, settings);
