const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const settings = {
	dimensions: [1048, 1048],
};

let manager;

let text = 'ubu';
let fontSize = 200;
let fontFamily = 'serif';

// The canvas that is used as a bitmap.
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
	const cell = 8;
	const cols = Math.floor(width / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;

	typeCanvas.width = cols;
	typeCanvas.height = rows;

	return ({ context, width, height }) => {
		typeContext.fillStyle = 'black';
		typeContext.fillRect(0, 0, cols, rows);

		fontSize = cols / 2;

		typeContext.fillStyle = 'white';
		typeContext.font = `${fontSize}px ${fontFamily}`;
		typeContext.textBaseline = 'top';

		// Get the dimensions of the text in order to position it
		const metrics = typeContext.measureText(text);
		const mx = metrics.actualBoundingBoxLeft * -1;
		const my = metrics.actualBoundingBoxAscent * -1;
		const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
		const mh =
			metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

		// Position the text in the center of it's canvas
		const tx = (cols - mw) * 0.5 - mx;
		const ty = (rows - mh) * 0.5 - my;

		typeContext.save();
		typeContext.translate(tx, ty);

		typeContext.beginPath();
		typeContext.rect(mx, my, mw, mh);
		typeContext.stroke();

		typeContext.fillText(text, 0, 0);

		typeContext.restore();

		// Get the data of the canvas. Returns an array with values between 0 and 255.
		// Based on the rgba values of every pixel.
		const typeData = typeContext.getImageData(0, 0, cols, rows).data;

		context.textBaseline = 'middle';
		context.textAlign = 'center';

		// context.drawImage(typeCanvas, 0, 0);

		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		for (i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const x = col * cell;
			const y = row * cell;

			// Get the rgba values out of the typeData array.
			const r = typeData[i * 4 + 0];
			const g = typeData[i * 4 + 1];
			const b = typeData[i * 4 + 2];
			const a = typeData[i * 4 + 3];

			// Create glyphs based on the red value of every pixel
			const glyph = getGlyph(r);

			context.fillStyle = 'white';

			context.save();
			context.translate(x, y);
			context.translate(cell * 0.5, cell * 0.5);

			context.font = `${cell * 2}px ${fontFamily}`;
			if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;
			context.fillText(glyph, 0, 0);

			context.restore();
		}
	};
};

const getGlyph = (v) => {
	if (v < 50) return ``;
	if (v < 100) return `.`;
	if (v < 150) return `-`;
	if (v < 200) return `+`;

	const glyphs = '_= /'.split('');

	return random.pick(glyphs);
};

const onKeyUp = (e) => {
	text = e.key.toUpperCase();
	manager.render();
};

document.addEventListener('keyup', onKeyUp);

canvasSketch(sketch, settings).then((res) => (manager = res));
