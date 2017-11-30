import ROT from '../vendor/rot';
import bus from '../vendor/eventbus.min';

import { passable, randInt } from './utils';

import Actor from './actor';
import PlayerController from './controllers/player';
import Collapser from './collapser';
import TileTypes from './map/tiletypes';
import generateMap from './map/generator';
import Item from './item';
import Glyph from './glyph';

const w = 50;
const h = 25;

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
		/*let distKeyToExit = distance(
			this.map.exitKey[0],
			this.map.exitKey[1],
			this.map.exit[0],
			this.map.exit[1]
		);*/
		let astar = new ROT.Path.AStar(this.map.exit[0], this.map.exit[1], passable, {topology: 4});
		let totalTime = 0;
		astar.compute(this.map.exitKey[0], this.map.exitKey[1], (x, y)=>{
			totalTime++;
		})

		console.log(totalTime);
		let c = new Collapser(
			this.map,
			Math.floor(totalTime / 3) * 2 + randInt(0, 3),
			Math.floor(totalTime / 3) + randInt(0, 3)
		);
		bus.addEventListener('revealExit',(e,x,y) => {
			c.timer.activate();
			c.state = "notInTheWay";
		});
		//Add Timer Listener
		bus.addEventListener('tickTimer', (e) => {
			let x = w - 2;
			let timerText = '';
			if(c.timer.activated){
				let count = e.target.count;
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
			}
			else{
				timerText = '%c{black}%b{skyblue}--';
			}
			this.display.drawText(x, 0, timerText);
		});
		bus.dispatch('tickTimer', c.timer);

		//Create UI
		this.resetItemsUI();
		bus.addEventListener('pickup', (e, actor) => {
			let item = e.target;
			if(typeof item.slot == "undefined" || item.slot){
				this.display.drawText(3, h + actor.inventory.length-1, item.name);
			}
			else if(item.type='exit_key'){
				this.display.drawText(Math.floor(w/2)+1,h,item.name);
			}
		});

		this.engine.start();
	},
	resetItemsUI(){
		let blanks = " ".repeat(Math.floor(w / 2) - 3);
		for(let i = 0; i < 4; i++){
			let text = (i+1)+": "+(this.player.inventory[i] || blanks+"|");
			this.display.drawText(0, h+i, text);
		}
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
