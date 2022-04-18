const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1480, 1920],
};

let manager;

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = '#f0efeb';
		context.fillRect(0, 0, width, height);

		const x = width / 2;
		const y = height / 2;

		context.save();

		context.beginPath();
		context.translate(x - 600, y - 400);
		context.rect(0, 0, 400, 600);
		context.fillStyle = '#797d62';
		context.fill();

		context.restore();
		context.save();

		context.beginPath();
		context.translate(x + 400, y - 800);
		context.rotate(45);
		context.rect(0, 0, 400, 600);
		context.fillStyle = '#faf9f9';
		context.fill();

		context.restore();
		context.save();

		context.beginPath();
		context.translate(x - 400, y + 200);
		context.rect(0, 0, 300, 100);
		context.fillStyle = '#ffcb69';
		context.fill();

		context.restore();
		context.save();

		context.beginPath();
		context.translate(x, y);
		context.arc(300, 200, 50, 0, Math.PI * 2);
		context.lineWidth = 30;
		context.strokeStyle = '#011627';
		context.stroke();

		context.restore();
	};
};

const onKeyUp = (e) => {
	e.key == 'r' && manager.render();
	e.key == 'p' && manager.togglePlay();
};

document.addEventListener('keyup', onKeyUp);

canvasSketch(sketch, settings).then((res) => (manager = res));

// context.shadowColor = 'rgba(0,0,0,0.2)';
// context.shadowBlur = 40;
// context.shadowOffsetX = 6;
// context.shadowOffsetY = 6;
