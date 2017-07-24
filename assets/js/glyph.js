import Game from './game';

export default class Glyph {
	constructor(x, y, chr, fg, bg){
		this._x = x;
		this._y = y;
		this._chr = chr || ' ';
		this._fg = fg || null;
		this._bg = bg || null;
	}
	draw(){
		Game.display.draw(this.x, this.y, this.chr, this.fg, this.bg);
	}
	//Setters and Getters for properties
	//When any of those properties are updated, the console redraws the glyph
	get x(){ return this._x; }
	set x(x){ this._x = x; this.draw(); }
	get y(){ return this._y; }
	set y(y){ this._y = y; this.draw(); }
	get chr(){ return this._chr; }
	set chr(chr){ this._chr = chr; this.draw(); }
	get fg(){ return this._fg; }
	set fg(fg){ this._fg = fg; this.draw(); }
	get bg(){ return this._bg; }
	set bg(bg){ this._bg = bg; this.draw(); }
}