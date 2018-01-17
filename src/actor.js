import bus from '../vendor/eventbus.min';

import Game from './game';

export default class Actor {
	constructor(name, x, y, glyph, controller){
		this.name = name;
		this.x = x;
		this.y = y;
		this.glyph = glyph;
		this.controller = controller || null;
		this.inventory = [];
		Game.actors.push(this);
		Game.scheduler.add(this,true);
	}
	pickup(item){
		this.inventory.push(item);
		item.x = -1;
		item.y = -1;
	}
	drop(item){
		let index = this.inventory.indexOf(item);
		if(index > -1){
			this.inventory.splice(index, 1);
		}
		else{
			throw new Error(`'${item.name}' not in ${this.name}'s inventory`)
		}
	}
	act(){
		if(this.controller){
			this.controller.run(this);
		}
	}
	draw(){
		this.glyph.draw(this.x, this.y);
	}
	collides(x, y){
		let collides = false;
		let other = null;
		Game.actors.forEach((actor)=>{
			if(this!=actor && x==actor.x && y==actor.y){
				collides = true;
				other = actor;
			}
		});
		return [collides, other];
	}
	kill(){
		Game.map.get(this.x, this.y).draw();
		Game.scheduler.remove(this);
		Game.actors.splice(Game.actors.indexOf(this),1);
		if(this == Game.player){
			Game.over(false);
		}
	}
	move(x, y, pusher){
		if(!Game.map.inBounds(x, y)){
			return 0;
		}
		let tileType = Game.map.get(x, y).type;
		switch(tileType){
			case 'sky':
				if(pusher){
					this.kill();
					return 1;
				}
				return 0;
				break;
			case 'exit':
				bus.dispatch('exit', this);
				//Game.nextLevel();
				break;
		}
		//Check actor collision
		let [collides, other] = this.collides(x, y);
		if(collides){
			//Push actor
			let dx = x - this.x;
			let dy = y - this.y;
			let mv = other.move(other.x+dx,other.y+dy, this);
			if(!mv){
				return 0;
			}
		}
		//Check item collision
		for(let item of Game.map.items){
			if(x==item.x && y==item.y){
				this.pickup(item);
				bus.dispatch('pickup', this, item);
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
		bus.dispatch('moveout', this, cx, cy);
		bus.dispatch('movein', this, x, y);
		this.draw();
		return 1;
	}
}
