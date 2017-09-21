import Game from '../game';
import BasicAI from './basic';

export default class StunnerAI extends BasicAI{
	run(actor) {
		let path = this.findPath(actor, Game.player.x, Game.player.y);
		this.moveToPlayer(actor, path);
	}
}