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
		this.glyph.draw(this.x, this.y);
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
				Game.map.get(this.x, this.y).draw();
				Game.scheduler.remove(this);
				Game.actors.splice(Game.actors.indexOf(this),1);
				if(this == Game.player){
					Game.over(false);
				}
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
		//Reset actor's previous tile and draw actor on new tile
		Game.map.get(cx, cy).draw();
		this.draw();
		return 1;
	}
	nearEdge(){
		let x = this.x;
		let y = this.y;
		let results = [];
		let neighbors = [[x-1,y],[x,y-1],[x+1,y],[x,y+1]];
		let sky = null;
		neighbors.forEach((n)=>{
			if(Game.map.get(n[0],n[1]).type == 'sky'){
				results.push({x:n[0],y:n[1]});
			}
		});
		if(results.length < 1){
			return 0;
		}
		return results;
	}
}