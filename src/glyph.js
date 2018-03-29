import Game from './game';

export default class Glyph {
	constructor(chr, fg, bg){
		this.history = [[chr || ' ', fg || '#fff', bg || null]];
	}
	_tail(){
		return this.history[this.history.length - 1];
	}
	get chr() {
		return this._tail()[0];
	}
	set chr(chr) {
		this.history.push([chr, this.fg, this.bg]);
	}
	get fg() {
		return this._tail()[1];
	}
	set fg(fg) {
		this.history.push([this.chr, fg, this.bg]);
	}
	get bg(){
		return this._tail()[2];
	}
	set bg(bg) {
		this.history.push([this.chr, this.fg, bg]);
	}
	pop(){
		if (this.history.length > 1) {
			return new Glyph(...this.history.pop());
		}
		return this;
	}
	draw(x, y){
		Game.display.draw(x, y, this.chr, this.fg, this.bg);
	}
}
