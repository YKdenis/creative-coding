const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1480, 1920],
};

let manager;

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = '#f0efeb';
		context.fillRect(0, 0, width, height);

		const recW = 800;
		const recH = 1000;
		const x = width / 2 - recW / 2;
		const y = height / 2 - recH / 2;

		context.save();

		context.beginPath();
		context.translate(x, y - 200);
		context.shadowColor = 'rgba(0,0,0,0.2)';
		context.shadowBlur = 40;
		context.shadowOffsetX = 6;
		context.shadowOffsetY = 6;
		context.rect(0, 0, recW, recH);
		context.fillStyle = '#011627';
		context.fill();

		context.restore();
		context.save();

		context.beginPath();
		context.translate(x + 600, y);
		context.rotate(45);
		context.shadowColor = 'rgba(0,0,0,0.2)';
		context.shadowBlur = 40;
		context.shadowOffsetX = 6;
		context.shadowOffsetY = 6;
		context.rect(0, 0, recW, recH);
		context.fillStyle = '#faf9f9';
		context.fill();

		context.restore();
		context.save();

		context.beginPath();
		context.translate(-0.1 * width, height - 75);
		// context.shadowColor = 'rgba(0,0,0,0.2)';
		// context.shadowBlur = 10;
		// context.shadowOffsetX = -9;
		// context.shadowOffsetY = -9;
		context.rect(0, 0, width * 1.2, 100);
		context.fillStyle = '#ddbea9';
		context.fill();
		context.strokeStyle = '#011627';
		context.lineWidth = 50;
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
