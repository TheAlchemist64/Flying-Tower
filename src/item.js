import bus from '../vendor/eventbus.min';
import Events from './events';

export default class Item {
	constructor(name, glyph, evt, slot, x, y){
		this.name = name;
		this.glyph = glyph;
		this.x = x || -1;
		this.y = y || -1;
		this.slot = slot;
		if(evt){
			bus.addEventListener(evt, Events[evt]);
			bus.addEventListener('pickup', (e, actor, x, y)=>{
				bus.dispatch(evt, this, x, y);
			})
		}
	}
	draw(){
		if(this.x > -1 && this.y > -1){
			this.glyph.draw(this.x, this.y);
		}
	}
}
