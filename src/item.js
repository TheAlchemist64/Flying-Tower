import bus from '../vendor/eventbus.min';
import Events from './events';

export default class Item {
	constructor(name, glyph, evt, slot, x, y){
		this.name = name;
		this.glyph = glyph;
		this._x = x || -1;
		this._y = y || -1;
		this.slot = slot;
		bus.addEventListener('moveout', (e, x, y) => {
			if(x==this._x && y==this._y){
				this.draw();
			}
		});
		bus.addEventListener('movein', (e, x, y) => {
			if(x==this.x && y==this.y){
				this.x = -1;
				this.y = -1;
				if((typeof slot=="undefined" || slot) && e.target.inventory){
					e.target.inventory.push(this);
				}
				bus.dispatch('pickup',this, e.target, x, y);
			}
		});
		if(evt){
			bus.addEventListener(evt, Events[evt]);
			bus.addEventListener('pickup', (e, actor, x, y)=>{
				bus.dispatch(evt, this, x, y);
			})
		}
	}
	draw(){
		this.glyph.draw(this._x, this._y);
	}
	get x(){ return this._x; }
	get y(){ return this._y; }
	set x(x){
		if(x >= 0 && this._y > 0){
			this._x = x;
			this.draw();
		}
		else if(this._x > 0 && this._y > 0){
			bus.dispatch('resetTile', this, this._x, this._y);
			this._x = x;
		}
		else{
			this._x = x;
		}
	}
	set y(y){
		if(y >= 0 && this._y > 0){
			this._y = y;
			this.draw();
		}
		else if(this._x > 0 && this._y > 0){
			bus.dispatch('resetTile', this, this._x, y);
		}
		else{
			this._y = y;
		}
	}
}
