import Game, { randTile, randFloor } from "../game";
import { Tile, TileTypes } from "../tile";

export default class Collapser{
	constructor(delay){
		this.delay = delay || 0; // # of turns to wait before collapsing tiles
		Game.scheduler.add(this,true);
	}
	act(){
		if(this.delay > 0){
			this.delay--;
		}
		else{
			let [x, y] = randFloor(Game.map);
			//Collapse tile
			Game.map.set(new Tile(x, y, TileTypes.SKY));
			Game.map.get(x, y).draw();
		}
	}
}