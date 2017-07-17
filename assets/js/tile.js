import Enum from './enum';
import Game from './game';

export let TileTypes = new Enum('EMPTY','FLOOR','WALL');

export class Tile {
	constructor(x, y, chr){
		this.x = x;
		this.y = y;
		this.chr = chr;
	}
	draw(){
		Game.display.draw(this.x, this.y, this.chr, '#fff');
	}
}