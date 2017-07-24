import Game from './game';

export default class Glyph {
	constructor(chr, fg, bg){
		this.chr = chr || ' ';
		this.fg = fg || null;
		this.bg = bg || null;
	}
	//Setters and Getters for properties
	//When any of those properties are updated, the console redraws the glyph
	/*get chr(){ return this._chr; }
	set chr(chr){ this._chr = chr; Game.bus.dispatch('redraw',this); }
	get fg(){ return this._fg; }
	set fg(fg){ this._fg = fg; this.draw(); }
	get bg(){ return this._bg; }
	set bg(bg){ this._bg = bg; this.draw(); }*/
}