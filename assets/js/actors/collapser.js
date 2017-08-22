import Game, { randTile } from "../game";
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
			let [x, y] = [null, null];
			while(!x && !y){
				//Choose a random tile
				let pick = randTile();
				//Check that tile is not exit
				if(Game.map.get(pick[0], pick[1]).type == 'exit'){
					continue;
				}
				//Check that it's not the tile the player is currently standing on.
				if(Game.player.x != pick[0] || Game.player.y != pick[1]){
					[x, y] = pick;
				}
			}
			//Collapse tile
			Game.map.set(x, y, new Tile(x, y, TileTypes.SKY));
			Game.map.get(x, y).draw();
		}
	}
}