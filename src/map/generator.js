import ROT from '../../vendor/rot';
import PriorityQueue from '../../vendor/priority-queue.min';

import { distance } from '../game';
import TileMap from './map';
import Tile from './tile';
import TileTypes from './tiletypes';

const distFromExit = 25;

export default function generateMap(w,h){
	let map = new TileMap(w, h);
	let generator = new ROT.Map.Digger(w-1, h-1, { dugPercentage: 0.8});
	//Create Floor and Sky tiles
	generator.create((x, y, wall)=>{
		let SKY = TileTypes.SKY;
		let FLOOR = TileTypes.FLOOR;
		map.set(new Tile(x, y+1, wall ? SKY: FLOOR));
	});
	//Create exit
	map.exit = map.floors.dequeue();
	map.set(new Tile(map.exit[0], map.exit[1], TileTypes.EXIT));
	//Create start location
	let [rX, rY] = [null, null];
	while(map.floors.length > 0){
		[rX, rY] = map.floors.dequeue();
		let dist = distance(...map.exit, rX, rY);
		if(dist >= distFromExit){
			console.log(dist);
			break;
		}
	}
	map.start = { x: rX, y: rY };
	console.log(map.start);
	return map;
}