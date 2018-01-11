import ROT from '../vendor/rot';
import bus from '../vendor/eventbus.min';

import { passable, betweenPlayerAndExit, getPathToExit } from './utils';

import Game from './game';
import Tile from "./map/tile";
import TileTypes from './map/tiletypes';
import Timer from './timer';
import FloorPicker from './floorpicker';

export default class Collapser{
	constructor(map, s1, s2){
		this.map = map;
		this.state = "notInTheWay";
		this.timer = new Timer('Stage 1', s1, () => {
			this.state = "notOnPath";
		});
		this.timer.then(new Timer('Stage 2', s2, ()=>{
			this.state = "canBeFatal";
		}));
		this.timer.activate();
		Game.scheduler.add(this,true);
	}
	collapseTile(x, y){
		this.map.set(new Tile(x, y, TileTypes.SKY));
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
	collapseSection(){
		Object.keys(this.map.floors).forEach(floor => {
			let [x,y] = floor.split(',');
			if(!this.map.get(x, y).connected){
				this.collapseTile(x, y);
				this.map.get(x, y).draw();
			}
		});
	}
	collapseWithMethod(f){
		let pick = null;
		let [x, y] = [null, null];
		let done = [];
		while(!FloorPicker.empty()){
			pick = FloorPicker.pick();
			[x, y] = pick.split(',').map(x => Number(x));
			let accepted = false;
			f(x, y, () => accepted = true, () => done.push({x: x, y: y}));
			if(accepted){
				break;
			}
		}
		if(!FloorPicker.empty()){
			this.collapseTile(x, y);
			delete this.map.floors[pick];
			this.map.get(x, y).draw();
			this.map.tiles.forEach((tile,k)=>{
				tile.connected = false;
			});
			this.updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
			this.collapseSection();
		}
		if(this.map.get(Game.player.x, Game.player.y).type=='sky'){
			Game.over(false);
		}
		done.forEach(p => FloorPicker.put(p));
	}
	act(){
		let pick = null;
		let done = [];
		switch(this.state){
			case "notInTheWay":
				this.collapseWithMethod((x, y, accept, reject) => {
					if(betweenPlayerAndExit(x, y)){
						reject();
					}
					else if(passable(x, y)){
						this.collapseTile(x, y);
						if(getPathToExit().length > 0){
							this.map.set(new Tile(x, y, TileTypes.FLOOR));
							accept();
						}
						this.map.set(new Tile(x, y, TileTypes.FLOOR));
					}
					else{
						console.log(x+", "+y);
					}
				});
				break;
			case "notOnPath":
				this.collapseWithMethod((x, y, accept, reject) => {
					if(passable(x, y)){
						this.collapseTile(x, y);
						if(getPathToExit().length > 0){
							this.map.set(new Tile(x, y, TileTypes.FLOOR));
							accept();
						}
						else{
							reject();
							this.map.set(new Tile(x, y, TileTypes.FLOOR));
						}
					}
				});
				break;
			case "canBeFatal":
				this.collapseWithMethod((x, y, accept, reject) => {
					if(passable(x, y)){
						accept();
					}
				});
				break;
		}
		if(this.map.get(Game.player.x, Game.player.y).type=='sky'){
			Game.over(false);
		}
		done.forEach(pick => FloorPicker.put(pick.join(',')));
	}
}
