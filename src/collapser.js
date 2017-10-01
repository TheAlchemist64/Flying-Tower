import ROT from '../vendor/rot';
import bus from '../vendor/eventbus.min';

import Game, { randTile } from "./game";
import Tile from "./map/tile";
import TileTypes from './map/tiletypes';

const notBetweenPnE = 2;
const notOnPath = 3;
const canBeFatal = 4;

export default class Collapser{
	constructor(map, delay){
		this.map = map;
		this.delay = delay || 0; // # of turns to wait before collapsing tiles
		this.steps = 0;
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
		if(!map.inBounds(x, y)){
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
	betweenPlayerAndExit(x, y){
		let dx = this.map.exit[0] - Game.player.x;
		let dy = this.map.exit[1] - Game.player.y;
		let innerProduct = (x - Game.player.x) * dx + (y - Game.player.y) * dy;
		return 0 <= innerProduct && innerProduct <= dx*dx + dy*dy;
	}
	collapseUnconnected(){
		this.map.tiles.forEach((tile, k)=>{
			tile.connected = false;
		});
		this.updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
		this.map.tiles.forEach(tile => {
			if(tile.type=='floor' && !tile.connected){
				this.collapseTile(tile.x, tile.y);
				tile.draw();
			}
		});
	}
	collapseSectionNotOnPath(){
		/*while(Object.keys(this.map.floors).length > this.getPathToExit().length){
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
					this.collapseSection();
					break;
				}
				else{
					this.map.set(tmp);
				}
			}
			else if(Object.keys(this.map.floors).length == 0){
				break;
			}
		}*/
		while(this.map.floors.length > 0 && this.map.floors.length > this.getPathToExit().length){
			let [x, y] = this.map.floors.dequeue();
			let tmp = this.map.get(x, y);
			this.collapseTile(x, y);
			if(this.getPathToExit().length  > 0){
				this.map.get(x, y).draw();
				this.collapseUnconnected();
				break;
			}
			else{
				this.map.set(tmp);
			}
		}
	}
	act(){
		if(this.delay > 0){
			this.delay--;
			bus.dispatch('tickCollapseTimer', this, this.delay);
		}
		else{
			this.steps++;
			if(this.map.floors.length > 0){
				if(this.steps % canBeFatal == 0){
					//any tile can be collapsed, which can be fatal to the player
					/*let pick = randFloor(this.map);
					if(pick!=null){
						this.collapseTile(...pick);
						delete this.map.floors[pick];
						this.map.get(...pick).draw();
						this.map.tiles.forEach((tile,k)=>{
							tile.connected = false;
						});
						this.updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
						this.collapseSection();
						if(this.map.get(Game.player.x, Game.player.y).type=='sky'){
							Game.over(false);
						}
					}*/
					let [x, y] = this.map.floors.dequeue();
					this.collapseTile(x, y);
					this.map.get(x, y).draw();
					this.collapseUnconnected();
					if(this.map.get(Game.player.x, Game.player.y).type=='sky'){
						Game.over(false);
					}
				}
				else if(this.steps % notOnPath == 0){
					//the tile collapsed cannot be on the shortest path to the exit
					this.collapseSectionNotOnPath();
				}
				else if(this.steps % notBetweenPnE == 0){
					//The tile cannot be between the player and the exit at all.
					/*let pick = null;
					while(pick==null || this.betweenPlayerAndExit(...pick)){
						pick = randFloor(this.map);
					
					}
					this.collapseTile(...pick);
					delete this.map.floors[pick];
					this.map.get(...pick).draw();
					this.map.tiles.forEach((tile,k)=>{
						tile.connected = false;
					});
					this.updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
					this.collapseSection();*/
					let [x, y] = [null, null];
					let valid = false;
					let n = 0;
					while(!valid && n != this.map.floors.length){
						[x, y] = this.map.floors.dequeue();
						if(this.betweenPlayerAndExit(x, y)){
							this.map.floors.queue([x, y]);
							n++;
						}
					}
					this.collapseTile(x, y);
					this.collapseUnconnected();
				}
			}
		}
	}
}