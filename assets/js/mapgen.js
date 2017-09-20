import ROT from '../../vendor/rot';
import PriorityQueue from '../../vendor/priority-queue.min';
import Game, { randFloor, distance } from './game';
import TileMap from './map';
import { Tile, TileTypes } from './tile';

const distFromExit = 25;

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
	delete map.floors[Game.exit.join(',')];
	map.set(new Tile(Game.exit[0], Game.exit[1], TileTypes.EXIT));
	//Create start location
	let queue = new PriorityQueue({ 
		comparator: (a,b) => ROT.RNG.getUniform() * 2 - 1,
		initialValues: Object.keys(map.floors)
	});
	let [rX, rY] = [null, null];
	while(queue.length > 0){
		let f = queue.dequeue();
		[rX, rY] = f.split(',').map(x => Number(x));
		let dist = distance(...Game.exit, rX, rY);
		if(dist >= distFromExit){
			console.log(dist);
			break;
		}
	}
	map.start = { x: rX, y: rY };
	console.log(map.start);
	return map;
}