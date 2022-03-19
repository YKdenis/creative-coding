const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1080, 1080],
};

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);
		context.strokeStyle = '#FFFFFF';

		const w = width * 0.1;
		const h = height * 0.1;
		const gap = width * 0.03;
		const iX = width * 0.13;
		const iY = height * 0.13;
		const offsetW = width * 0.02;
		const offsetH = height * 0.02;
		let x, y;

		for (let i = 0; i <= 5; i++) {
			for (let j = 0; j <= 5; j++) {
				x = iX + (w + gap) * j;
				y = iY + (h + gap) * i;
				let doubleBorder = false;

				context.lineWidth = width * 0.003;
				context.beginPath();
				context.rect(x, y, w, h);
				context.stroke();

				if (Math.random() > 0.5) {
					doubleBorder = true;
					context.beginPath();
					context.rect(
						x + offsetW / 2,
						y + offsetH / 2,
						w - offsetW,
						h - offsetH
					);
					context.stroke();
				}

				if (doubleBorder === true && Math.random() > 0.5) {
					context.beginPath();
					context.rect(
						x + offsetW,
						y + offsetH,
						w - offsetW * 2,
						h - offsetH * 2
					);
					context.stroke();
				}
			}
		}
	};
};

canvasSketch(sketch, settings);
