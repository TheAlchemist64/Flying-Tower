import ROT from '../../../vendor/rot';
import Game, { randTile, randFloor } from "../game";
import { Tile, TileTypes } from "../tile";

export default class Collapser{
	constructor(delay){
		this.delay = delay || 0; // # of turns to wait before collapsing tiles
		Game.scheduler.add(this,true);
	}
	collapseTile(x, y){
		Game.map.set(new Tile(x, y, TileTypes.SKY));
	}
	collapseTileGroup(tiles){
		tiles.forEach(tile => this.collapseTile(tile.x, tile.y));
	}
	isExitReachable(){
		let passable = (x, y) => Game.map.get(x, y).type != "sky";
		let astar = new ROT.Path.AStar(Game.exit[0], Game.exit[1], passable, {topology: 4});
		let path = [];
		astar.compute(Game.player.x, Game.player.y, (x, y) => {
			path.push([x, y]);
		});
		return path.length > 0;
	}
	checkConnections(map){
		
	}
	act(){
		if(this.delay > 0){
			this.delay--;
		}
		else{
			while(true){
				let pick = randFloor(Game.map);
				if(pick!=null){
					let tmp = Game.map.get(...pick);
					this.collapseTile(...pick);
					if(this.isExitReachable()){
						Game.map.get(...pick).draw();
						break;
					}
					else{
						Game.map.set(tmp);
					}
				}
				else if(Object.keys(Game.map.floors).length == 0){
					break;
				}
			}
		}
	}
}