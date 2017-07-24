import ROT from '../../vendor/rot';
import Game from './game';

export class Actor {
	constructor(name, x, y, glyph){
		this.name = name;
		this.x = x;
		this.y = y;
		this.glyph = glyph;
	}
	draw(){
		Game.display.draw(this.x, this.y, this.glyph.chr, this.glyph.fg, this.glyph.bg);
	}
	move(x, y){
		//Capture current position
		let cx = this.x;
		let cy = this.y;
		//Set new position
		this.x = x;
		this.y = y;
		//Dispatch event for graphical change
		Game.bus.dispatch('move', this, cx, cy);
	}
}

export class Player extends Actor{
	handleEvent(e){
		let code = e.keyCode;
		let x = this.x;
		let y = this.y;
		switch(code){
			case ROT.VK_UP:
				super.move(x,y-1);
				break;
			case ROT.VK_RIGHT:
				super.move(x+1,y);
				break;
			case ROT.VK_DOWN:
				super.move(x,y+1);
				break;
			case ROT.VK_LEFT:
				super.move(x-1,y);
				break;
		}
	}
}