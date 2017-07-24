import Game from './game';

export default class Actor {
	constructor(name, x, y, glyph){
		this.name = name;
		this.x = x;
		this.y = y;
		this.glyph = glyph;
		Game.actors.push(this);
		Game.scheduler.add(this,true);
	}
	act(){}
	draw(){
		Game.display.draw(this.x, this.y, this.glyph.chr, this.glyph.fg, this.glyph.bg);
	}
	move(x, y){
		if(!Game.map.inBounds(x, y) || Game.map.get(x, y).type == 'wall'){
			return;
		}
		let collides = false;
		Game.actors.forEach((actor)=>{
			if(x==actor.x && y==actor.y){
				collides = true;
			}
		});
		if(collides){
			return;
		}
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