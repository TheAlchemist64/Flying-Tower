import Game from '../game';
import BasicAI from './basic';

class PusherAI extends BasicAI{
	run(actor){
		let [result, tile] = Game.player.canFall();
		if(!result){
			return;
		}
		//Get the tile the AI needs to be on in order to push the player off
		let x = Game.player.x - (tile.x - Game.player.x);
		let y = Game.player.y - (tile.y - Game.player.y);
		//Find path
		let path = this.findPath(actor, x, y);
		//Move actor
		if(path.length == 1){
			actor.move(Game.player.x, Game.player.y);
		}
		else if(path.length > 1){
			actor.move(path[1].x, path[1].y);
		}
	}
}

export { PusherAI };