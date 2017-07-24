import ROT from '../../vendor/rot';
import EventBus from '../../vendor/eventbus.min';

import TileMap from './map.js';
import { Tile, TileTypes } from './tile.js';
import { Player } from './actor';
import Glyph from './glyph';

const w = 50;
const h = 25;

export default {
	display: null,
	map: null,
	bus: null,
	
	init: function(){
		this.display = new ROT.Display({width: w, height: h});
		document.body.appendChild(this.display.getContainer());
		
		this.map = new TileMap(w, h);
		
		let generator = new ROT.Map.Arena(w,h);
		generator.create((x, y, wall)=>{
			let WALL = TileTypes.WALL;
			let FLOOR = TileTypes.FLOOR;
			this.map.set(x, y, new Tile(x, y, wall ? WALL: FLOOR));
		});
		
		this.map.draw();
		
		this.bus = EventBus;
		
		this.bus.addEventListener('move',this.map.reset,this.map);
		
		let a = new Player('Player',4,4,new Glyph('@','#fff'));
		a.draw();
		window.addEventListener('keydown',a.handleEvent.bind(a));
	}
}