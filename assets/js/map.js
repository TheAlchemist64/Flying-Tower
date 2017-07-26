import { Tile, TileTypes } from './tile';

export default class TileMap {
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.tiles = new Map();
		for(let x = 0; x < width; x++){
			for(let y = 0; y < height; y++){
				this.tiles.set(x+','+y,new Tile(x, y, TileTypes.SKY));
			}
		}
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
	nearEdge(x, y){
		let result = new Map();
		let neighbors = [[x-1,y],[x,y-1],[x+1,y],[x,y+1]];
		neighbors.forEach((n)=>{
			result[this.get(n[0],n[1]).type] = true;
		});
		return result['sky'];
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