import ROT from '../../vendor/rot';
import EventBus from '../../vendor/eventbus.min';

import TileMap from './map.js';
import { Tile, TileTypes } from './tile.js';
import Actor from './actor';
import Player from './actors/player';
import Glyph from './glyph';

const w = 50;
const h = 25;

var randInt = function(a, b){
	return a + Math.floor((b-a) * ROT.RNG.getUniform());
}

export default {
	display: null,
	map: null,
	bus: null,
	actors: [],
	player: null,
	scheduler: null,
	engine: null,
	
	init(){
		this.display = new ROT.Display({width: w, height: h});
		document.body.appendChild(this.display.getContainer());
		
		this.map = new TileMap(w, h);
		
		let generator = new ROT.Map.Arena(w-4,h-4);
		generator.create((x, y, wall)=>{
			let WALL = TileTypes.WALL;
			let FLOOR = TileTypes.FLOOR;
			this.map.set(x+2, y+2, new Tile(x+2, y+2, wall ? WALL: FLOOR));
		});
		//Generate holes in the floor
		let holes = 5;
		while(holes > 0){
			let x = randInt(2, w-2);
			let y = randInt(2, h-2);
			this.map.set(x, y, new Tile(x, y, TileTypes.SKY));
			holes--;
		}
		this.map.draw();
		
		this.bus = EventBus;
		
		this.bus.addEventListener('in-bounds',this.map.inBounds,this.map);
		
		this.bus.addEventListener('reset',(e, x, y)=>{
			this.map.reset(e, x, y);
		},this.map);
		
		this.bus.addEventListener('fall',(e)=>{
			this.map.reset(e,e.target.x,e.target.y);
			this.scheduler.remove(e.target);
			this.actors.splice(this.actors.indexOf(e.target),1);
			if(e.target == this.player){
				this.over(false);
			}
		},this.map);
		
		this.bus.addEventListener('add-to-game',(e)=>{
			this.actors.push(e.target);
			this.scheduler.add(e.target,true);
		});
		
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		
		this.player = new Player('Player',4,4,new Glyph('@','#fff'));
		this.player.draw();
		
		let m = new Actor('Monster',8,8,new Glyph('m','#f00'));
		m.draw();
		
		this.engine.start();
	},
	over(victory){
		this.scheduler = null;
		this.engine = null;
		let text = '';
		if(victory){
			text = 'Congradulations! You won!';
		}
		else{
			text = 'Game over. You lost!';
		}
		this.display.drawText(w/2-text.length/2,h/2,text);
	}
}