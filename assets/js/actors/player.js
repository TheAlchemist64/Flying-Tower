import Actor from '../actor';
import ROT from '../../../vendor/rot';
import Game from './../game';

export default class Player extends Actor{
	act(){
		Game.engine.lock();
		window.addEventListener('keydown',this);
	}
	handleEvent(e){
		let code = e.keyCode;
		let x = this.x;
		let y = this.y;
		switch(code){
			case ROT.VK_UP:
				super.move(x,y-1);
				Game.bus.dispatch('playermove', this);
				break;
			case ROT.VK_RIGHT:
				super.move(x+1,y);
				Game.bus.dispatch('playermove', this);
				break;
			case ROT.VK_DOWN:
				super.move(x,y+1);
				Game.bus.dispatch('playermove', this);
				break;
			case ROT.VK_LEFT:
				super.move(x-1,y);
				Game.bus.dispatch('playermove', this);
				break;
			case ROT.VK_PERIOD:
				break; //Wait
			default:
				return; //Keyboard input not recognized.
		}
		window.removeEventListener('keydown',this);
		Game.engine.unlock();
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