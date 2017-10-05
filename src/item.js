import bus from '../vendor/eventbus.min';

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
		bus.addEventListener('movein', (e, x, y) => {
			if(x==this.x && y==this.y){
				this.x = -1;
				this.y = -1;
				if(e.target.inventory){
					e.target.inventory.push(this);
					bus.dispatch('pickup',this, e.target);
					console.log(e.target.inventory);
				}
			}
		});
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