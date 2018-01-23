import bus from '../vendor/eventbus.min';

import Game from './game';
import { checkCollision } from './utils';

function tileEvent(type, actor, x, y) {
	switch(type){
		case 'sky':
			if(actor.hasItem('Earth Rune')){
				bus.dispatch('skyStep', actor, x, y);
				return true;
			}
			break;
		case 'exit':
			bus.dispatch('exit', actor);
			return false;
			break;
	}
}

export default class Actor {
	constructor(name, x, y, glyph, controller){
		this.name = name;
		this.x = x;
		this.y = y;
		this.glyph = glyph;
		this.controller = controller || null;
		this.inventory = [];
		this.dead = false;
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
	hasItem(name){
		for(let item of this.inventory){
			if(item.name == name){
				return true;
			}
		}
		return false;
	}
	act(){
		if(this.controller){
			this.controller.run(this);
		}
	}
	draw(){
		this.glyph.draw(this.x, this.y);
	}
	kill(){
		this.dead = true;
		Game.map.get(this.x, this.y).draw();
		Game.scheduler.remove(this);
		Game.actors.splice(Game.actors.indexOf(this),1);
		let eIndex = Game.map.enemies.indexOf(this);
		if(eIndex > -1){
			Game.map.enemies.splice(eIndex);
		}
		if(this == Game.player){
			Game.over(false);
		}
	}
	move(x, y, pusher, nodraw){
		//Check that (x,y) within map boundaries
		if(!Game.map.inBounds(x, y)){
			return 0;
		}
		let tileType = Game.map.get(x, y).type;
		let endTurn = tileEvent(tileType, this, x, y);
		if(endTurn){
			return 1;
		}
		switch(tileType){
			case 'sky':
				if(pusher){
					this.kill();
					return 1;
				}
				return 0;
				break;
		}
		//Check actor collision
		let other = checkCollision(x, y);
		if(other){
			//Push actor
			let mv = null;
			let canMove = (x) => mv = x;
			bus.dispatch('attack', this, other, pusher, canMove);
			if(!mv){
				return 1;
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
		if(!nodraw){
			this.draw();
		}
		return 1;
	}
}
