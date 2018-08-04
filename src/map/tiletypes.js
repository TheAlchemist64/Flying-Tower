import Glyph from '../glyph';

export default {
	WALL: {
		name: 'wall',
		glyph: new Glyph('#')
	},
	FLOOR: {
		name: 'floor',
		glyph: new Glyph('.')
	},
	DOOR: {
		name: 'door',
		glyph: new Glyph('+')
	},
	SKY: {
		name: 'sky',
		glyph: new Glyph(' ',null,'skyblue')
	},
	EXIT: {
		name: 'exit',
		glyph: new Glyph('^', 'white')
	},
	BLOCK: {
		name: 'block',
		glyph: new Glyph('#','silver')
	}
}
