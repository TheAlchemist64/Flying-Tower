import ROT from '../../vendor/rot';
import EventBus from '../../vendor/eventbus.min';

import TileMap from './map.js';
import { Tile, TileTypes } from './tile.js';
import Player from './actors/player';
import Monster from './actors/monster';
import Collapser from './actors/collapser';
import Glyph from './glyph';
import { PusherAI } from './ai/pushoff';
import StunnerAI from './ai/stun';
import generateMap from './mapgen';

const w = 50;
const h = 25;
const distFromExit = 25;

export var randInt = function(a, b){
	return a + Math.floor((b-a) * ROT.RNG.getUniform());
}

export function randTile(){
	return [randInt(2, w-2), randInt(2, h-2)];
}

export function randFloor(map){
	let floors = Object.keys(map.floors);
	if(floors.length > 0){
		let floor = floors[randInt(0, floors.length)];
		let [x, y] = floor.split(',');
		return [Number(x), Number(y)];
	}
	else{
		return null;
	}
}

export function distance(x1, y1, x2, y2){ 
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2)); 
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
		//Generate map with dimensions (w, h)
		this.map = generateMap(w, h);
		//Draw map
		this.map.draw();
		//Add Event Bus to global object
		this.bus = EventBus;
		//Initialize Turn Engine
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		//Create Player
		let validStart = false;
		let [rX, rY] = [null, null];
		while(!validStart){
			let f = randFloor(this.map);
			if(f){
				[rX, rY] = f;
				let dist = distance(this.exit[0], this.exit[1], rX, rY);
				if(dist >= distFromExit){
					validStart = true;
					console.log(dist);
				}
			}
		}
		this.player = new Player('Player',rX,rY,new Glyph('@','#fff'));
		this.player.draw();
		//Create test monster
		//let m = new Monster('Monster',8,8,new Glyph('m','#f00'),new PusherAI());
		//m.draw();
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