import Enum from './enum';
import Glyph from './glyph';
import Game from './game';

export let TileTypes = {
	WALL: {
		name: 'wall',
		glyph: new Glyph('#')
	},
	FLOOR: {
		name: 'floor',
		glyph: new Glyph('.')
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
		Game.display.draw(this.x, this.y, this.glyph.chr, this.glyph.fg, this.glyph.bg);
	}
}