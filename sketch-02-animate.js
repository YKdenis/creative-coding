const canvasSketch = require('canvas-sketch');
const {
	math: { mapRange, degToRad },
	random: { range },
} = require('canvas-sketch-util');

const settings = {
	dimensions: [1080, 1080],
	animate: true,
};

const colors = ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

// const degToRad = (deg) => (deg / 180) * Math.PI;

// const randomRange = (min, max) => Math.random() * (max - min) + min;

const sketch = ({ context, width, height }) => {
	const cx = width * 0.5;
	const cy = height * 0.5;
	const widthRect = 0.01 * width;
	const heightRect = 0.1 * height;
	const radius = width * 0.4;

	let rects = [];

	const num = 20;
	const radOfEachSlice = degToRad(360 / num);

	for (i = 0; i < num; i++) {
		let angle = radOfEachSlice * i;
		const x = Math.floor(range(0, width));
		const y = Math.floor(range(0, height));

		rects.push(new Rect(x, y, radius, angle));
	}

	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.fillStyle = '#fff';

		rects.map((rect, i) => {
			rect.update();
			rect.bounce(width, height);
			rect.draw(context, widthRect, heightRect);
		});

		// for (i = 0; i < rect.length; i++) {

		// clock *******

		// arc *******
		// context.save();
		// context.translate(cx, cy);
		// context.rotate(-angle);
		// context.lineWidth = range(20, 30);

		// context.beginPath();
		// context.arc(
		// 	0,
		// 	0,
		// 	radius * range(0.4, 1),
		// 	radOfEachSlice * range(0, -2),
		// 	radOfEachSlice * range(1, 2)
		// );
		// context.strokeStyle = colors[Math.floor(range(0, 4.99))];
		// context.stroke();
		// context.restore();
		// }
	};
};

canvasSketch(sketch, settings);

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	getDistance(v) {
		const dx = this.x - v.x;
		const dy = this.y - v.y;
		return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy ^ 2, 2));
	}
}

class Rect {
	constructor(x, y, radius, angle) {
		this.pos = new Vector(x, y);
		this.vel = new Vector(range(-1, 1), range(-1, 1));
		this.radius = radius;
		this.angle = angle;
		this.x = this.pos.x + radius * Math.sin(angle);
		this.y = this.pos.y + radius * Math.cos(angle);
	}

	update() {
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		this.angle += this.vel.y * 0.01;
	}

	draw(context, w, h) {
		// context.fillStyle = colors[Math.floor(range(0, 4.99))];

		context.save();
		context.translate(this.pos.x, this.pos.y);
		context.rotate(this.angle);

		context.beginPath();
		context.rect(-w * 0.5, -h * 0.5, w, h);
		context.fill();
		context.restore();
	}

	bounce(width, height) {
		if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
		if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
	}
}
