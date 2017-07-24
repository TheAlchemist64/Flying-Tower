import Game from './game';

export default class Glyph {
	constructor(chr, fg, bg){
		this.chr = chr || ' ';
		this.fg = fg || null;
		this.bg = bg || null;
	}
}