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
			this.event = evt;
			bus.addEventListener(evt.name, Events[evt.name]);
			/*bus.addEventListener('pickup', (e, actor, x, y)=>{
				bus.dispatch(evt.name, this, actor, x, y);
			})*/
		}
	}
	draw(){
		if(this.x > -1 && this.y > -1){
			this.glyph.draw(this.x, this.y);
		}
	}
}
