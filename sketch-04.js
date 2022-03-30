const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
	dimensions: [1080, 1080],
	animate: true,
};

const sketch = () => {
	return ({ context, width, height, frame }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		const cols = 75;
		const rows = 75;
		const numCells = cols * rows;

		const gridWidth = width * 0.8;
		const gridHeight = height * 0.8;

		const cellWidth = gridWidth / cols;
		const cellHeight = gridHeight / rows;

		const marginX = (width - gridWidth) / 2;
		const marginY = (height - gridHeight) / 2;

		for (i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cellWidth;
			const y = row * cellHeight;
			const w = cellWidth * 0.8;
			const h = cellHeight * 0.8;

			const n = random.noise2D(x + frame * 7, y, 0.002);
			const angle = n * Math.PI * 0.2;
			const scale = ((n + 1) / 2) * 30;

			context.save();

			context.translate(x, y);
			context.translate(marginX, marginY);
			context.translate(cellWidth * 0.5, cellHeight * 0.5);
			context.rotate(angle);

			context.lineWidth = scale;

			context.beginPath();
			context.moveTo(w * -0.5, 0);
			context.lineTo(w * 0.5, 0);
			context.strokeStyle = '#f5cac3';
			context.stroke();

			context.restore();
		}
	};
};

canvasSketch(sketch, settings);
