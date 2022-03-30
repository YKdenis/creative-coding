const canvasSketch = require('canvas-sketch');
const {
	random: { range, noise2D },
	math,
} = require('canvas-sketch-util');

const settings = {
	dimensions: [1080, 1080],
	animate: true,
};

const sketch = () => {
	return ({ context, width, height, frame }) => {
		const colors = [
			'#f8f9fa',
			'#e9ecef',
			'#dee2e6',
			'#ced4da',
			'#adb5bd',
			'#6c757d',
			'#495057',
			'#343a40',
			'#212529',
		];

		context.fillStyle = '#000';
		context.fillRect(0, 0, width, height);

		const cols = 150;
		const rows = 150;
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

			const n = noise2D(x - frame * 5, y + frame * 5, 0.005);
			const angle = n * Math.PI * 0.2;
			const scale = ((n + 1) / 2) * 5;

			context.save();

			context.translate(x + n * 30, y + n * 30);
			context.translate(marginX, marginY);
			context.translate(cellWidth * 0.5, cellHeight * 0.5);
			context.rotate(angle);

			context.lineWidth = scale;

			context.beginPath();
			context.moveTo(w * -0.5, 0);
			context.lineTo(w * 0.5, 0);
			context.strokeStyle = colors[0];
			context.strokeStyle =
				colors[(i + Math.floor(numCells / i)) % colors.length];
			context.strokeStyle = colors[i % colors.length];
			context.stroke();

			context.restore();
		}
	};
};

canvasSketch(sketch, settings);
