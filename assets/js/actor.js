import Game from './game';

export default class Actor {
	constructor(name, x, y, glyph){
		this.name = name;
		this.x = x;
		this.y = y;
		this.glyph = glyph;
		Game.bus.dispatch('add-to-game', this);
	}
	act(){}
	draw(){
		Game.bus.dispatch('draw', this);
	}
	move(x, y){
		if(!Game.map.inBounds(x, y)){
			return 0;
		}
		let tileType = Game.map.get(x, y).type;
		switch(tileType){
			case 'wall':
				return 0;
				break;
			case 'sky':
				Game.bus.dispatch('fall',this);
				return 1;
		}
		let collides = false;
		let other = null;
		Game.actors.forEach((actor)=>{
			if(x==actor.x && y==actor.y){
				collides = true;
				other = actor;
			}
		});
		if(collides){
			//Push actor
			let dx = x - this.x;
			let dy = y - this.y;
			let mv = other.move(other.x+dx,other.y+dy);
			if(!mv){
				return 0;
			}
		}
		//Capture current position
		let cx = this.x;
		let cy = this.y;
		//Set new position
		this.x = x;
		this.y = y;
		//Dispatch event for graphical change
		Game.bus.dispatch('move', this, cx, cy);
		return 1;
	}
}