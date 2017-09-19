import ROT from '../../vendor/rot';
import Game, { randFloor, distance } from './game';
import TileMap from './map';
import { Tile, TileTypes } from './tile';

export default function generateMap(w,h){
	let map = new TileMap(w, h);
	//Generate Arena
	let generator = new ROT.Map.Digger(w-1, h-1, { dugPercentage: 0.8});
	generator.create((x, y, wall)=>{
		let SKY = TileTypes.SKY;
		let FLOOR = TileTypes.FLOOR;
		map.set(new Tile(x+2, y+2, wall ? SKY: FLOOR));
	});
	//Create exit
	Game.exit = randFloor(map);
	map.set(new Tile(Game.exit[0], Game.exit[1], TileTypes.EXIT));
	
	return map;
}