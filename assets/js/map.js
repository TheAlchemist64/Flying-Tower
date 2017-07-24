import Game from './game';
import { Tile } from './tile';

export default class TileMap {
	constructor(){
		this.tiles = new Map();
	}
	set(x, y, tile){
		this.tiles.set(x+','+y,tile);
	}
	get(x, y){
		return this.tiles.get(x+','+y);
	}
	draw(){
		for(var tile of this.tiles.values()){
			tile.draw();
		}
	}
	reset(e, x, y){
		//Redraw Tile
		this.get(x, y).draw();
		e.target.draw();
	}
}