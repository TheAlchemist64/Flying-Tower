import ROT from '../../vendor/rot';

import { distance, checkCollision } from '../utils';
import TileMap from './map';
import Tile from './tile';
import Glyph from '../glyph';
import FloorPicker from '../floorpicker';
import Decorator from '../decorator';
import TileTypes from './tiletypes';
import ItemFactory from '../itemfactory';
import ActorFactory from '../actorfactory';

const distFromExit = 20;
const SENTINELS = 10;

function placeItem(itemName, map) {
	ItemFactory.createItem(itemName, map, ...Decorator.pick());
}

function placeEnemy(enemyName, map) {
	map.enemies.push(ActorFactory.createActor(enemyName, ...Decorator.pick()));
}

export default function generateMap(w,h){
	let map = new TileMap(w, h);
	let generator = new ROT.Map.Digger(w-2, h-2, { dugPercentage: 0.8});
	//Create Floor and Sky tiles
	generator.create((x, y, wall)=>{
		let WALL = TileTypes.WALL;
		let FLOOR = TileTypes.FLOOR;
		map.set(new Tile(x+1, y+1, wall ? WALL: FLOOR));
	});
	//Create Items
	Decorator.setRooms(generator.getRooms());
	placeItem('WIND_RUNE', map);
	placeItem('EARTH_RUNE', map);
	placeItem('ICE_RUNE', map);
	placeItem('FIRE_RUNE', map);



	//Set Floor Picker for Collapser
	FloorPicker.setMap(map);
	//Place enemies
	map.enemies = map.enemies.concat(ActorFactory.createActors('SENTINEL', SENTINELS));
	//Create exit
	let pickExit = Decorator.pick();
	map.exit = pickExit;
	map.set(new Tile(map.exit[0], map.exit[1], TileTypes.EXIT));
	//Create start location
	let done = [];
	let pickStart = null;
	let startIndex = Decorator.index;
	while (!Decorator.empty()) {
		pickStart = Decorator.pick();
		if(distance(...pickStart, ...pickExit) >= distFromExit){
			map.start = {x: pickStart[0], y: pickStart[1]};
			break;
		}
		else{
			done.push(pickStart);
		}
	}
	done.forEach(pick => Decorator.put(...pick, startIndex++));
	return map;
}
