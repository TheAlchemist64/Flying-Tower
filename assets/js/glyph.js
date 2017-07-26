import Game from './game';

export default class Glyph {
	constructor(chr, fg, bg){
		this.chr = chr || ' ';
		this.fg = fg || '#fff';
		this.bg = bg || null;
	}
	draw(x, y){
		Game.display.draw(x, y, this.chr, this.fg, this.bg);
	}
}