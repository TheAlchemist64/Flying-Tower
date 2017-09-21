export default class Tile {
	constructor(x, y, type){
		this.x = x;
		this.y = y;
		this.type = type.name;
		this._glyph = type.glyph;
		this.connected = false;
	}
	get glyph(){ return this._glyph; }
	set glyph(glyph) { this._glyph = glyph; this.draw(); }
	draw(){
		this.glyph.draw(this.x, this.y);
	}
}