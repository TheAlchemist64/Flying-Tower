import Game from './game';
import { Tile } from './tile';

export default class TileMap {
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.tiles = new Map();
	}
	set(x, y, tile){
		this.tiles.set(x+','+y,tile);
	}
	get(x, y){
		return this.tiles.get(x+','+y);
	}
	inBounds(x, y){
		return x > 0 && x < this.width && y> 0 && y < this.height;
	}
	draw(){
		for(var tile of this.tiles.values()){
			tile.draw();
		}
	}
	reset(e, x, y){
		//Redraw Tile
		this.get(x, y).draw();
	}
}