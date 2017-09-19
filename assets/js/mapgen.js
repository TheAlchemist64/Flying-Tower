import ROT from '../../vendor/rot';
import Game, { randFloor, distance } from './game';
import TileMap from './map';
import { Tile, TileTypes } from './tile';

export default function generateMap(w,h){
	/*
		Map Generation is divided into "layers"
			1. Map is initialized with all sky tiles
			2. Use 'Digger/Tunneler' algorithm to draw 'dungeon' made up of walls and 
				floor tiles
			3. Draw outer walls: Layer a rectangle of walls over "dungeon" from step 2
			4. Mark tiles "inside" or "outside" based on position of walls from step 3
			5. Assign appropriate glyph
	*/
	let map = new TileMap(w, h);
	//Generate Arena
	//let generator = new ROT.Map.Arena(w-4,h-4);
	let generator = new ROT.Map.Digger(w-1, h-1, { dugPercentage: 0.8});
	generator.create((x, y, wall)=>{
		let SKY = TileTypes.SKY;
		let FLOOR = TileTypes.FLOOR;
		map.set(new Tile(x+2, y+2, wall ? SKY: FLOOR));
	});
	//Generate Rooms
	
	//Generate Corridors
	//Generate holes in the floor
	/*let holes = 5;
	while(holes > 0){
		let [x, y] = randTile();
		map.set(new Tile(x, y, TileTypes.SKY));
		holes--;
	}*/
	//Create exit
	Game.exit = randFloor(map);
	map.set(new Tile(Game.exit[0], Game.exit[1], TileTypes.EXIT));
	
	return map;
}