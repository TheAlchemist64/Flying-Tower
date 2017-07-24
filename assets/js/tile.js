import Enum from './enum';
import Glyph from './glyph';
import Game from './game';

export let TileTypes = {
	WALL: new Glyph('#'),
	FLOOR: new Glyph('.')
}

export class Tile {
	constructor(x, y, glyph){
		this.x = x;
		this.y = y;
		this._glyph = glyph;
	}
	get glyph(){ return this._glyph; }
	set glyph(glyph) { this._glyph = glyph; this.draw(); }
	draw(){
		Game.display.draw(this.x, this.y, this.glyph.chr, this.glyph.fg, this.glyph.bg);
	}
}