import ROT from '../../vendor/rot';
import Game, { randTile } from './game';
import TileMap from './map';
import { Tile, TileTypes } from './tile';

export default function generateMap(w,h){
	//Generate Arena
	let map = new TileMap(w, h);
	let generator = new ROT.Map.Arena(w-4,h-4);
	generator.create((x, y, wall)=>{
		let WALL = TileTypes.WALL;
		let FLOOR = TileTypes.FLOOR;
		map.set(new Tile(x+2, y+2, wall ? WALL: FLOOR));
	});
	//Generate holes in the floor
	let holes = 5;
	while(holes > 0){
		let [x, y] = randTile();
		map.set(new Tile(x, y, TileTypes.SKY));
		holes--;
	}
	//Create exit
	let [exitX, exitY] = randTile();
	map.set(new Tile(exitX, exitY, TileTypes.EXIT));
	
	return map;
}