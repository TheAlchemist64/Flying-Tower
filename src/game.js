import ROT from '../vendor/rot';
import bus from '../vendor/eventbus.min';

import Actor from './actor';
import PlayerController from './controllers/player';
import Collapser from './collapser';
import TileTypes from './map/tiletypes';
import generateMap from './map/generator';
import Item from './item';
import Glyph from './glyph';

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
	actors: [],
	player: null,
	scheduler: null,
	engine: null,

	init(){
		//Initialize Display
		this.display = new ROT.Display({width: w, height: h + 4});
		document.body.appendChild(this.display.getContainer());
		//Generate map with dimensions (w, h)
		this.map = generateMap(w, h);
		//Draw map
		this.map.draw();
		//Tell map to listen for reset tile events
		bus.addEventListener('resetTile', (e, x, y) => {
			this.map.get(x, y).draw();
		});
		//Initialize Turn Engine
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = new ROT.Engine(this.scheduler);
		//Create Player
		this.player = new Actor('Player',this.map.start.x,this.map.start.y,TileTypes.PLAYER.glyph, new PlayerController());
		this.player.draw();
		//Create test monster
		//let m = new Monster('Monster',8,8,new Glyph('m','#f00'),new PusherAI());
		//m.draw();
		//Add Tile Collapser to map
		let c = new Collapser(this.map, 20, 15, 10);
		bus.addEventListener('tickTimer', (e) => {
			let x = w - 2;
			let count = e.target.count;
			let timerText = '';
			if(count==0 && e.target.name=='Stage 2'){
				timerText = '%c{red}';
			}
			else if(e.target.name=='Stage 2'){
				timerText = '%c{yellow}';
			}
			else if(e.target.name=='Stage 1'){
				timerText = '%c{green}';
			}
			else{
				timerText = '%c{black}';
			}
			timerText+='%b{skyblue}';
			if(count < 10){
				timerText += '0'+count;
			}
			else{
				timerText += count;
			}
			this.display.drawText(x, 0, timerText);
		});
		bus.dispatch('tickTimer', c.timer);

		//Create UI
		for(let i = 0; i < 4; i++){
			this.display.drawText(0, h+i, (i+1)+": "+(this.player.inventory[i] || ""));
		}
		bus.addEventListener('pickup', (e, actor) => {
			let item = e.target;
			this.display.drawText(3, h + actor.inventory.length-1, item.name);
		});

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
