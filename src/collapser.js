import ROT from '../vendor/rot';
import bus from '../vendor/eventbus.min';

import { passable, betweenPlayerAndExit, getPathToExit } from './utils';

import Game from './game';
import Tile from "./map/tile";
import TileTypes from './map/tiletypes';
import Timer from './timer';
import FloorPicker from './floorpicker';

function updateConnections(map, x, y){
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
	updateConnections(map, x, y-1);
	updateConnections(map, x+1, y);
	updateConnections(map, x, y+1);
	updateConnections(map, x-1, y);
}

export default class Collapser{
	constructor(map, s1, s2){
		this.map = map;
		this.stage = "notInTheWay";
		this.timer = new Timer('Stage 1', s1, () => {
			this.stage = "notOnPath";
		});
		this.timer.then(new Timer('Stage 2', s2, ()=>{
			this.stage = "canBeFatal";
		}));
		this.timer.activate();
		Game.scheduler.add(this,true);
	}
	collapseTile(x, y){
		this.map.set(new Tile(x, y, TileTypes.SKY));
	}
	collapseSection(){
		this.map.tiles.forEach((tile, pos) => {
			let [x,y] = pos.split(',');
			if(tile.type!='sky' && !this.map.get(x, y).connected){
				this.collapseTile(x, y);
				this.map.get(x, y).draw();
			}
		});
	}
	collapseWithMethod(f){
		let [x, y] = [null, null];
		let done = [];
		while(!FloorPicker.empty()){
			let tile = FloorPicker.pick();
			x = tile.x;
			y = tile.y;
			let accepted = false;
			f(x, y, () => accepted = true, () => done.push({x: x, y: y}));
			if(accepted){
				break;
			}
		}
		if(!FloorPicker.empty()){
			this.collapseTile(x, y);
			this.map.get(x, y).draw();
			this.map.tiles.forEach((tile,k)=>{
				tile.connected = false;
			});
			updateConnections(this.map, this.map.exit[0], this.map.exit[1]);
			this.collapseSection();
		}
		Game.actors.forEach(actor => {
			if(this.map.get(actor.x, actor.y).type == 'sky'){
				actor.kill();
			}
		});
		done.forEach(p => FloorPicker.put(p));
	}
	act(){
		let pick = null;
		let done = [];
		switch(this.stage){
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
