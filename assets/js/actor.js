import Game from './game';

export class Actor {
	constructor(name, x, y, glyph){
		this.name = name;
		this.x = x;
		this.y = y;
		this.glyph = glyph;
	}
	draw(){
		Game.map.get(this.x, this.y).glyph = this.glyph;
	}
}

export class Player extends Actor{
	
}