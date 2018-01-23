import ROT from '../../vendor/rot';

import { distance } from '../utils';
import TileMap from './map';
import Tile from './tile';
import FloorPicker from '../floorpicker';
import Decorator from '../decorator';
import TileTypes from './tiletypes';
import ItemFactory from '../itemfactory';

const distFromExit = 40;

export default function generateMap(w,h){
	let map = new TileMap(w, h);
	let generator = new ROT.Map.Digger(w-1, h-1, { dugPercentage: 0.8});
	//Create Floor and Sky tiles
	generator.create((x, y, wall)=>{
		let SKY = TileTypes.SKY;
		let FLOOR = TileTypes.FLOOR;
		map.set(new Tile(x+1, y+1, wall ? SKY: FLOOR));
	});
	//Create Wind Rune
	Decorator.setRooms(generator.getRooms());
	let windXY = Decorator.pick();
	ItemFactory.createItem('WIND_RUNE', map, ...windXY);

	//Create exit
	FloorPicker.setMap(map);
	let pick = Decorator.pick();
	map.exit = pick;
	delete map.floors[pick.join(',')];
	map.set(new Tile(map.exit[0], map.exit[1], TileTypes.EXIT));
	//Create start location
	let [rX, rY] = [null, null];
	let done = [];
	while(!FloorPicker.empty()){
		let pick = FloorPicker.pick();
		[rX, rY] = pick.split(',').map(x => Number(x));
		let dist = distance(...map.exit, rX, rY);
		if(dist >= distFromExit){
			break;
		}
		else{
			done.push(pick);
		}
	}
	done.forEach(p => FloorPicker.put(p));
	map.start = { x: rX, y: rY };
	return map;
}
