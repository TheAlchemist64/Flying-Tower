import ROT from '../../vendor/rot';
import bus from '../../vendor/eventbus.min';

import Game from '../game';
import Controller from '../controller';

function lightPasses(x, y) {
	return Game.map.get(x, y).type != 'wall';
}

export default class PlayerController extends Controller {
	constructor(){
		super();
		this.actor = null;
		this.fov = new ROT.FOV.RecursiveShadowcasting(lightPasses);
		bus.addEventListener('exit', (e)=>{
			if(e.target==this.actor){
				Game.nextLevel();
			}
		})
	}
	drawFOV(){
		this.fov.compute(Game.player.x, Game.player.y, 10, (x, y, r, v) => {
			Game.map.get(x, y).draw();
			Game.map.items.forEach(item => {
				if(item.x == x && item.y == y){
					item.draw();
				}
			});
			Game.map.enemies.forEach(enemy => {
				if(enemy.x == x && enemy.y == y){
					enemy.draw();
				}
			});
		});
	}
	run(actor){
		super.run(actor);
		if(!this.actor){
			this.actor = actor;
		}
		Game.engine.lock();
		window.addEventListener('keydown',this);
	}
	handleEvent(e){
		this.drawFOV();
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
				break; //Wait
			default:
				return; //Keyboard input not recognized.
		}
		this.drawFOV();
		this.actor.draw();
		if(endTurn){
			this.actor = null;
			window.removeEventListener('keydown',this);
			Game.engine.unlock();
		}
	}
}
