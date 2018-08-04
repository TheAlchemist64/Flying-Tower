import Tile from './tile';
import TileTypes from './tiletypes';

export default class TileMap {
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.tiles = new Map();
		this.items = [];
		this.enemies = [];
		this.start = {};
		this.exit = [];
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
		this.tiles.set(tile.x+','+tile.y,tile);
	}
	inBounds(x, y){
		return x > 0 && x < this.width && y> 0 && y < this.height;
	}
	dropItem(item){
		this.items.push(item);
	}
	draw(){
		/*for(var tile of this.tiles.values()){
			tile.draw();
		}*/
		this.items.forEach(item => item.draw());
		//this.enemies.forEach(enemy => enemy.draw());
	}
}
