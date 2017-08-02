import ROT from '../../../vendor/rot';
import Game from '../game';

function isPassable(actor, x, y){
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

export default class BasicAI {
	findPath(actor, x, y){
		/*
			Passable function callback for ROT.Path.Astar can only take x and y as parameters
			Create encapsulating function around isPassable to meet those requirements
		*/
		let passableCallback = function(x, y){
			let result = isPassable(actor, x, y);
			return result;
		}
		//Initialize pathfinder
		let finder = new ROT.Path.AStar(x, y, passableCallback, {topology:4});
		//Find path to tile where ai can push the player off
		let path = [];
		finder.compute(actor.x, actor.y, (x, y)=>{
			path.push({x: x, y: y});
		});
		return path;
	}
	moveToPlayer(actor, path){
		if(path.length == 1){
			actor.move(Game.player.x, Game.player.y);
		}
		else if(path.length > 1){
			actor.move(path[1].x, path[1].y);
		}
	}
}