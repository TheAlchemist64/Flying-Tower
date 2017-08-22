import ROT from '../../vendor/rot';
import EventBus from '../../vendor/eventbus.min';

import TileMap from './map.js';
import { Tile, TileTypes } from './tile.js';
import Actor from './actor';
import Player from './actors/player';
import Monster from './actors/monster';
import Collapser from './actors/collapser';
import Glyph from './glyph';
import { PusherAI } from './ai/pushoff';
import StunnerAI from './ai/stun';

const w = 50;
const h = 25;

export var randInt = function(a, b){
	return a + Math.floor((b-a) * ROT.RNG.getUniform());
}

export function randTile(){
	return [randInt(2, w-2), randInt(2, h-2)];
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
		//Initialize Display
		this.display = new ROT.Display({width: w, height: h});
		document.body.appendChild(this.display.getContainer());
		//Generate Map
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
			let [x, y] = randTile();
			this.map.set(x, y, new Tile(x, y, TileTypes.SKY));
			holes--;
		}
		//Create exit
		let [exitX, exitY] = randTile();
		this.map.set(exitX, exitY, new Tile(exitX, exitY, TileTypes.EXIT));
		//Draw map
		this.map.draw();
		//Add Event Bus to global object
		this.bus = EventBus;
		//Initialize Turn Engine
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		//Create Player
		this.player = new Player('Player',4,4,new Glyph('@','#fff'));
		this.player.draw();
		//Create test monster
		let m = new Monster('Monster',8,8,new Glyph('m','#f00'),new PusherAI());
		m.draw();
		//Add Tile Collapser to map
		let c = new Collapser();
		
		this.engine.start();
	},
	nextLevel(){
		this.scheduler.clear();
		let text = 'Multiple levels not implemented yet.'
		this.display.drawText(Math.floor(w/2)-Math.floor(text.length/2),Math.floor(h/2),text);
	},
	over(victory){
		//Game ended. Delete Scheduler and Engine
		this.scheduler.clear();
		//this.engine = null;
		let text = '';
		if(victory){
			text = 'Congradulations! You won!';
		}
		else{
			text = 'Game over. You lost!';
		}
		this.display.drawText(Math.floor(w/2)-Math.floor(text.length/2),Math.floor(h/2),text);
	}
}