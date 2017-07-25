import Game from './game';

export default class Glyph {
	constructor(chr, fg, bg){
		this.chr = chr || ' ';
		this.fg = fg || '#fff';
		this.bg = bg || null;
	}
}