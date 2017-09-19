import Glyph from './glyph';

export let TileTypes = {
	WALL: {
		name: 'wall',
		glyph: new Glyph('#')
	},
	FLOOR: {
		name: 'floor',
		glyph: new Glyph(' ')
	},
	SKY: {
		name: 'sky',
		glyph: new Glyph(' ',null,'skyblue')
	},
	EXIT: {
		name: 'exit',
		glyph: new Glyph('^', 'gold')
	}
}

export class Tile {
	constructor(x, y, type){
		this.x = x;
		this.y = y;
		this.type = type.name;
		this._glyph = type.glyph;
	}
	get glyph(){ return this._glyph; }
	set glyph(glyph) { this._glyph = glyph; this.draw(); }
	draw(){
		this.glyph.draw(this.x, this.y);
	}
}