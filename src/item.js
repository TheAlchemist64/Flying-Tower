import bus from '../vendor/eventbus.min';

import Game from './game';

export default class Item {
	constructor(name, glyph, x, y){
		this.name = name;
		this.glyph = glyph;
		this._x = x || -1;
		this._y = y || -1;
		bus.addEventListener('moveout', (e, x, y) => {
			if(x==this._x && y==this._y){
				this.draw();
			}
		});
	}
	draw(){
		this.glyph.draw(this._x, this._y);
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	set x(x){ 
		this._x = x; 
		if(x >= 0 && this._y > 0){
			this.draw();
		}
		else{
			Game.map.get(x, this.y).draw();
		}
	}
	set y(y){ 
		this._y = y; 
		if(y >= 0 && this._y > 0){
			this.draw();
		}
		else{
			Game.map.get(this.x, y).draw();
		}
	}
}