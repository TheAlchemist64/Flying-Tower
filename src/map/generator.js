import ROT from '../../vendor/rot';

import { distance, checkCollision } from '../utils';
import TileMap from './map';
import Tile from './tile';
import Glyph from '../glyph';
import FloorPicker from '../floorpicker';
import Decorator from '../decorator';
import TileTypes from './tiletypes';
import ItemFactory from '../itemfactory';
import Actor from '../actor';
import SentinelController from '../controllers/sentinel';

const distFromExit = 40;
const SENTINELS = 5;

export default function generateMap(w,h){
	let map = new TileMap(w, h);
	let generator = new ROT.Map.Digger(w-1, h-1, { dugPercentage: 0.8});
	//Create Floor and Sky tiles
	generator.create((x, y, wall)=>{
		let SKY = TileTypes.SKY;
		let FLOOR = TileTypes.FLOOR;
		map.set(new Tile(x+1, y+1, wall ? SKY: FLOOR));
	});
	//Create Items
	Decorator.setRooms(generator.getRooms());
	let windXY = Decorator.pick();
	ItemFactory.createItem('WIND_RUNE', map, ...windXY);
	let earthXY = Decorator.pick();
	ItemFactory.createItem('EARTH_RUNE', map, ...earthXY);


	//Create multiple sentinels
	FloorPicker.setMap(map);
	let picks = [];
	let numSentinels = 0;
	while(!FloorPicker.empty() && numSentinels < SENTINELS){
		let pick = FloorPicker.pick();
		let [sx, sy] = [pick.x, pick.y];
		if(!Number.isNaN(sx) && !Number.isNaN(sy)){
			let sentinel = new Actor('Sentinel', sx, sy, new Glyph('s','grey'), new SentinelController());
			picks.push({x: sx, y: sy});
			numSentinels++;
		}
	}
	picks.forEach(p => FloorPicker.put(p));
	//Create exit
	let pickExit = Decorator.pick();
	map.exit = pickExit;
	map.set(new Tile(map.exit[0], map.exit[1], TileTypes.EXIT));
	//Create start location
	let pick = null;
	let done = [];
	while(!FloorPicker.empty()){
		pick = FloorPicker.pick();
		let dist = distance(...map.exit, pick.x, pick.y);
		if(dist >= distFromExit && checkCollision(pick.x, pick.y)==null){
			break;
		}
		else{
			done.push(pick);
		}
	}
	done.forEach(p => FloorPicker.put(p));
	map.start = pick;
	return map;
}
