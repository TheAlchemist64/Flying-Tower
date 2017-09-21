import ROT from '../../../vendor/rot';
import bus from '../../../vendor/eventbus.min';

import Game, { randTile, randFloor } from "../game";
import Tile from "../tile";
import TileTypes from '../tiletypes';

export default class Collapser{
	constructor(map, delay){
		this.map = map;
		this.delay = delay || 0; // # of turns to wait before collapsing tiles
		Game.scheduler.add(this,true);
	}
	collapseTile(x, y){
		this.map.set(new Tile(x, y, TileTypes.SKY));
	}
	getPathToExit(){
		let passable = (x, y) => this.map.get(x, y).type != "sky";
		let astar = new ROT.Path.AStar(this.map.exit[0], this.map.exit[1], passable, {topology: 4});
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
			bus.dispatch('tickCollapseTimer', this, this.delay);
		}
		else{
			while(Object.keys(this.map.floors).length > this.getPathToExit().length){
				let pick = randFloor(this.map);
				if(pick!=null){
					let tmp = this.map.get(...pick);
					this.collapseTile(...pick);
					if(this.getPathToExit().length > 0){
						delete this.map.floors[pick];
						this.map.get(...pick).draw();
						this.map.tiles.forEach((tile,k)=>{
							tile.connected = false;
						});
						this.updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
						Object.keys(this.map.floors).forEach(floor => {
							let [x,y] = floor.split(',');
							if(!this.map.get(x, y).connected){
								this.collapseTile(x, y);
								this.map.get(x, y).draw();
							}
						});
						break;
					}
					else{
						this.map.set(tmp);
					}
				}
				else if(Object.keys(this.map.floors).length == 0){
					break;
				}
			}
		}
	}
}