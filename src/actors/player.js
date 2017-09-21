import ROT from '../../vendor/rot';
import bus from '../../vendor/eventbus.min';

import Game from './../game';
import Actor from '../actor';

export default class Player extends Actor{
	act(){
		super.act();
		Game.engine.lock();
		window.addEventListener('keydown',this);
	}
	handleEvent(e){
		let code = e.keyCode;
		let x = this.x;
		let y = this.y;
		let endTurn = 0;
		switch(code){
			case ROT.VK_UP:
				endTurn = super.move(x,y-1);
				bus.dispatch('playermove', this);
				break;
			case ROT.VK_RIGHT:
				endTurn = super.move(x+1,y);
				bus.dispatch('playermove', this);
				break;
			case ROT.VK_DOWN:
				endTurn = super.move(x,y+1);
				bus.dispatch('playermove', this);
				break;
			case ROT.VK_LEFT:
				endTurn = super.move(x-1,y);
				bus.dispatch('playermove', this);
				break;
			case ROT.VK_PERIOD:
				endTurn = true;
				this.draw();
				break; //Wait
			default:
				return; //Keyboard input not recognized.
		}
		if(endTurn){
			window.removeEventListener('keydown',this);
			Game.engine.unlock();
		}
	}	
	canFall(){
		let x = this.x;
		let y = this.y;
		let neighbors = [[x-1,y],[x,y-1],[x+1,y],[x,y+1]];
		let sky = null;
		neighbors.forEach((n)=>{
			if(Game.map.get(n[0],n[1]).type == 'sky'){
				sky = {x:n[0],y:n[1]};
			}
		});
		if(!sky){
			return [false, null];
		}
		return [true, sky];
	}
}