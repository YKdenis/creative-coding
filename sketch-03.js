const canvasSketch = require('canvas-sketch');
const {
	math: { degToRad, mapRange },
	random: { range },
} = require('canvas-sketch-util');
const tweakpane = require('tweakpane');

const settings = {
	dimensions: [1048, 1048],
	animate: true,
};

const animate = () => {
	requestAnimationFrame(animate);
};
// animate();

const params = {
	agentsNum: 40,
	lineWidth: 1,
	bounce: true,
	maxDistance: 200,
	color: '#000',
};

const sketch = ({ context, width, height }) => {
	let agents = [];
	for (i = 0; i <= params.agentsNum; i++) {
		const x = Math.floor(range(0, width));
		const y = Math.floor(range(0, height));

		agents.push(new Agent(x, y, 5));
	}

	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);

		for (i = 0; i < agents.length; i++) {
			const agent = agents[i];

			for (j = i + 1; j < agents.length; j++) {
				const otherAgent = agents[j];
				const distance = agent.pos.getDistance(otherAgent.pos);
				context.strokeStyle = params.color;

				if (distance < params.maxDistance) continue;

				context.lineWidth = params.lineWidth;

				context.beginPath();
				context.moveTo(agent.pos.x, agent.pos.y);
				context.lineTo(otherAgent.pos.x, otherAgent.pos.y);
				context.stroke();
			}
		}

		agents.map((agent, i) => {
			agent.update();
			params.bounce ? agent.bounce(width, height) : agent.wrap(width, height);
			agent.draw(context);
		});
	};
};

const createPane = () => {
	const pane = new tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Agents' });
	folder.addInput(params, 'bounce');
	folder.addInput(params, 'agentsNum', { min: 1, max: 100, step: 1 });
	folder.addInput(params, 'lineWidth', { min: 1, max: 20, step: 1 });
	folder.addInput(params, 'maxDistance', {
		min: 1,
		max: settings.dimensions[0],
		step: 1,
	});
	folder.addInput(params, 'color');
};

createPane();

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

class Agent {
	constructor(x, y, radius) {
		this.pos = new Vector(x, y);
		this.vel = new Vector(range(-0.5, 0.5), range(-0.5, 0.5));
		this.radius = radius;
	}

	update() {
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
	}

	draw(context) {
		context.lineWidth = 1;

		context.save();
		context.translate(this.pos.x, this.pos.y);

		context.beginPath();
		context.arc(0, 0, this.radius, 0, Math.PI * 2);
		context.strokeStyle = params.color;
		context.fillStyle = params.color;
		context.restore();
	}

	bounce(width, height) {
		if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
		if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
	}

	wrap(width, height) {
		if (this.pos.x < 0) this.pos.x = width;
		if (this.pos.x > width) this.pos.x = 0;
		if (this.pos.y < 0) this.pos.y = height;
		if (this.pos.y > height) this.pos.y = 0;
	}
}
