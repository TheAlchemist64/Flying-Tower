import ROT from '../vendor/rot';
import bus from '../vendor/eventbus.min';
import PriorityQueue from '../vendor/priority-queue.min';

import Game from './game';
import Tile from "./map/tile";
import TileTypes from './map/tiletypes';
import Timer from './timer';

export default class Collapser{
	constructor(map, delay, s1, s2){
		this.map = map;
		this.floors = new PriorityQueue({
			comparator: (a,b) => ROT.RNG.getUniform() * 2 - 1,
			initialValues: Object.keys(this.map.floors)
		});
		this.state = "delay";
		this.timer = new Timer('Delay', delay,()=>{
			this.state = "notInTheWay";
			this.timer = new Timer('Stage 1', s1,()=>{
				this.state = "notOnPath";
				this.timer = new Timer('Stage 2', s2, ()=>{
					this.state = "canBeFatal";
				});
				bus.dispatch('tickTimer',this.timer);
			});
			bus.dispatch('tickTimer',this.timer);
		})
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
	collapseSection(){
		Object.keys(this.map.floors).forEach(floor => {
			let [x,y] = floor.split(',');
			if(!this.map.get(x, y).connected){
				this.collapseTile(x, y);
				this.map.get(x, y).draw();
			}
		});
	}
	collapseSectionNotOnPath(){
		while(Object.keys(this.map.floors).length > this.getPathToExit().length){

		}
	}
	act(){
		let pick = null;
		let done = [];
		switch(this.state){
			case "notInTheWay":
				while (this.floors.length > 0) {
					pick = this.floors.dequeue();
					pick = pick.split(',').map(x => Number(x));
					if(this.betweenPlayerAndExit(...pick)){
						done.push(pick);
					}
					else if(this.map.get(...pick).type =="floor"){
						break;
					}
				}
				if(this.floors.length > 0){
					this.collapseTile(...pick);
					delete this.map.floors[pick];
					this.map.get(...pick).draw();
					this.map.tiles.forEach((tile,k)=>{
						tile.connected = false;
					});
					this.updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
					this.collapseSection();
				}
				break;
			case "notOnPath":
				while(this.floors.length > 0){
					pick = this.floors.dequeue();
					pick = pick.split(',').map(x => Number(x));
					if(this.map.get(...pick).type=="sky"){
						continue;
					}
					else if(this.getPathToExit().length > 0){
						break;
					}
					else{
						done.push(pick);
					}
				}
				if(this.floors.length > 0){
					this.collapseTile(...pick);
					delete this.map.floors[pick];
					this.map.get(...pick).draw();
					this.map.tiles.forEach((tile,k)=>{
						tile.connected = false;
					});
					this.updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
					this.collapseSection();
				}
				break;
			case "canBeFatal":
				while(this.floors.length > 0){
					pick = this.floors.dequeue();
					pick = pick.split(',').map(x => Number(x));
					if(this.map.get(...pick).type!="sky"){
						break;
					}
				}
				if(this.floors.length > 0){
					this.collapseTile(...pick);
					delete this.map.floors[pick];
					this.map.get(...pick).draw();
					this.map.tiles.forEach((tile,k)=>{
						tile.connected = false;
					});
					this.updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
					this.collapseSection();
				}
				break;
		}
		if(this.map.get(Game.player.x, Game.player.y).type=='sky'){
			Game.over(false);
		}
		done.forEach(pick => this.floors.queue(pick.join(',')));
	}
}
