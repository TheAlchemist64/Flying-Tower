import ROT from '../../vendor/rot';
import EventBus from '../../vendor/eventbus.min';

import TileMap from './map.js';
import { Tile, TileTypes } from './tile.js';
import Actor from './actor';
import Player from './actors/player';
import Glyph from './glyph';

const w = 50;
const h = 25;

export default {
	display: null,
	map: null,
	bus: null,
	actors: [],
	player: null,
	scheduler: null,
	engine: null,
	
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
		
		this.bus.addEventListener('move',(e, x, y)=>{
			this.map.reset(e, x, y);
			e.target.draw();
		},this.map);
		
		this.bus.addEventListener('fall',(e)=>{
			this.map.reset(e,e.target.x,e.target.y);
			this.scheduler.remove(e.target);
			this.actors.splice(this.actors.indexOf(e.target),1);
		},this.map);
		
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		
		this.player = new Player('Player',4,4,new Glyph('@','#fff'));
		this.player.draw();
		
		let m = new Actor('Monster',8,8,new Glyph('m','#f00'));
		m.draw();
		
		this.engine.start();
	}
}