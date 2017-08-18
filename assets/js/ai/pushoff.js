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
		//Move actor towards that tile
		let path = this.findPath(actor, x, y);
		this.moveToPlayer(actor, path);
	}
}

export { PusherAI };