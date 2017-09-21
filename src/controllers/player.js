import ROT from '../../vendor/rot';

import Game from '../game';
import Controller from '../controller';

export default class PlayerController extends Controller {
	run(actor){
		super.run(actor);
		this.actor = actor;
		Game.engine.lock();
		window.addEventListener('keydown',this);
	}
	handleEvent(e){
		let code = e.keyCode;
		let x = this.actor.x;
		let y = this.actor.y;
		let endTurn = 0;
		switch(code){
			case ROT.VK_UP:
				endTurn = this.actor.move(x,y-1);
				break;
			case ROT.VK_RIGHT:
				endTurn = this.actor.move(x+1,y);
				break;
			case ROT.VK_DOWN:
				endTurn = this.actor.move(x,y+1);
				break;
			case ROT.VK_LEFT:
				endTurn = this.actor.move(x-1,y);
				break;
			case ROT.VK_PERIOD:
				endTurn = true;
				this.draw();
				break; //Wait
			default:
				return; //Keyboard input not recognized.
		}
		if(endTurn){
			this.actor = null;
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