import ROT from '../../vendor/rot';
import { EventBus } from '../../vendor/eventbus.min';

const w = 50;
const h = 25;

export default {
	display: null,
	map: null,
	bus: null,
	
	init: function(){
		this.display = new ROT.Display({width: w, height: h});
		document.body.appendChild(this.display.getContainer());
		
		this.map = new ROT.Map.Arena(w,h);
		this.map.create((x, y, wall)=>{
			this.display.draw(x, y, wall ? '#': '.');
		});
		
		this.bus = EventBus;
	}
}