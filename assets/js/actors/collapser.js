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
	getPathToExit(){
		let passable = (x, y) => Game.map.get(x, y).type != "sky";
		let astar = new ROT.Path.AStar(Game.exit[0], Game.exit[1], passable, {topology: 4});
		let path = [];
		astar.compute(Game.player.x, Game.player.y, (x, y) => {
			path.push([x, y]);
		});
		return path;
	}
	updateConnections(map, x, y){
		if(x < 0 || y < 0 || x >= map.width || y >= map.height){
			return;
		}
		if(map.get(x, y).connected){
			return;
		}
		if(map.get(x, y).type == "sky"){
			return;
		}
		map.get(x, y).connected = true;
		this.updateConnections(map, x, y-1);
		this.updateConnections(map, x+1, y);
		this.updateConnections(map, x, y+1);
		this.updateConnections(map, x-1, y);
	}
	act(){
		if(this.delay > 0){
			this.delay--;
		}
		else{
			while(Object.keys(Game.map.floors).length > this.getPathToExit().length){
				let pick = randFloor(Game.map);
				if(pick!=null){
					let tmp = Game.map.get(...pick);
					this.collapseTile(...pick);
					if(this.getPathToExit().length > 0){
						delete Game.map.floors[pick];
						Game.map.get(...pick).draw();
						Game.map.tiles.forEach((tile,k)=>{
							tile.connected = false;
						});
						this.updateConnections(Game.map, Game.exit[0], Game.exit[1]);
						Object.keys(Game.map.floors).forEach(floor => {
							let [x,y] = floor.split(',');
							if(!Game.map.get(x, y).connected){
								this.collapseTile(x, y);
								Game.map.get(x, y).draw();
							}
						});
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