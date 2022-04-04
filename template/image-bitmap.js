const canvasSketch = require('canvas-sketch');
const { random } = require('canvas-sketch-util');
const settings = {
	dimensions: [1048, 1048],
};

let manager;
let fontFamily = 'serif';

const url = 'https://picsum.photos/id/152/3888/2592';
// const url =
// 'https://scontent.fbru4-1.fna.fbcdn.net/v/t1.6435-9/109954984_2742036666078187_1076946796826346229_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=174925&_nc_ohc=ik4CblnZczgAX9jLVaZ&tn=BKoI_vCTQ2ciE9K5&_nc_ht=scontent.fbru4-1.fna&oh=00_AT_4_-MR1NtzHgTEMunWtPH-loUCMbJLLF85PHcy1YTaFg&oe=626F0F41';
const loadImage = (url) => {
	return new Promise((res, rej) => {
		const image = new Image();
		image.onload = () => res(image);
		image.onerror = () => rej(image);
		image.crossOrigin = 'anonymous';
		image.src = url;
	});
};
let img = '';

const sketch = ({ context, width, height, update }) => {
	update({
		dimensions: [img.width, img.height],
	});

	return ({ context, width, height }) => {
		const cell = 10;
		const cols = Math.floor(width / cell);
		const rows = Math.floor(height / cell);
		const numCells = cols * rows;

		context.drawImage(img, 0, 0, width / cell, height / cell);

		const typeData = context.getImageData(0, 0, cols, rows).data;

		context.fillStyle = 'white';
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
			const glyph = getGlyph(b);

			context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

			context.save();
			context.translate(x, y);
			context.translate(cell * 0.5, cell * 0.5);

			context.font = `${cell * 2}px ${fontFamily}`;
			if (Math.random() < 0.2) context.font = `${cell * 10}px ${fontFamily}`;
			if (Math.random() < 0.1) context.font = `${cell * 15}px ${fontFamily}`;
			context.fillText(glyph, 0, 0);

			context.restore();
		}
	};
};

const getGlyph = (v) => {
	if (v < 50) return ``;
	if (v < 100) return `*`;
	if (v < 150) return `-`;
	if (v < 200) return `?`;

	const glyphs = '_= /!()><'.split('');

	return random.pick(glyphs);
};

const onKeyUp = (e) => {
	text = e.key.toUpperCase();
	manager.render();
};

document.addEventListener('keyup', onKeyUp);

loadImage(url)
	.then((res) => {
		img = res;
		return canvasSketch(sketch, settings);
	})
	.then((res) => (manager = res));
