import ROT from '../../../vendor/rot';
import Game from '../game';

function isPassable(x, y, actor){
	let passable = true;
	if(['wall','sky'].includes(Game.map.get(x, y).type)){
		passable = false;
	}
	let [collides, other] = actor.collides(x, y);
	if(collides){
		passable = false;
	}
	return passable;
}

class PusherAI {
	constructor(){
		this.finder = null;
		this.path = [];
	}
	run(actor){
		let [result, tile] = Game.player.canFall();
		if(!result){
			return;
		}
		//Get the tile the AI needs to be on in order to push the player off
		let x = Game.player.x - (tile.x - Game.player.x);
		let y = Game.player.y - (tile.y - Game.player.y);
		//Make passable function callback
		let passableCallback = function(x, y){
			let result = isPassable(x, y, actor);
			return result;
		}
		//Initialize pathfinder
		this.finder = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
		//Find path to tile where ai can push the player off
		this.path = [];
		this.finder.compute(actor.x, actor.y, (x, y)=>{
			this.path.push({x: x, y: y});
		});
		if(this.path.length == 1){
			actor.move(Game.player.x, Game.player.y);
		}
		else if(this.path.length > 1){
			actor.move(this.path[1].x, this.path[1].y);
		}
	}
}

export { PusherAI };