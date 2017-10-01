import ROT from '../../vendor/rot';
import PriorityQueue from '../../vendor/priority-queue.min';

import Tile from './tile';
import TileTypes from './tiletypes';

export default class TileMap {
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.tiles = new Map();
		this.floors = new PriorityQueue({
			comparator: (a,b) => ROT.RNG.getUniform() * 2 - 1
		});
		this.start = {};
		this.exit = null;
		for(let x = 0; x < width; x++){
			for(let y = 0; y < height; y++){
				this.tiles.set(x+','+y,new Tile(x, y, TileTypes.SKY));
			}
		}
	}
	get(x, y){
		return this.tiles.get(x+','+y);
	}
	set(tile){
		if(tile.type=="floor"){
			this.floors.queue([tile.x,tile.y]);
		}
		this.tiles.set(tile.x+','+tile.y,tile);
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