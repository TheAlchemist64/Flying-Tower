import { Tile, TileTypes } from './tile';

export default class TileMap {
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.tiles = new Map();
		this.floors = {};
		for(let x = 0; x < width; x++){
			for(let y = 0; y < height; y++){
				this.tiles.set(x+','+y,new Tile(x, y, TileTypes.SKY));
			}
		}
	}
	set(tile){
		this.tiles.set(tile.x+','+tile.y,tile);
		if(tile.type=="floor"){
			this.floors[tile.x+','+tile.y] = true;
		}
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
}