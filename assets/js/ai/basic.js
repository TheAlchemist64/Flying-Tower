import ROT from '../../../vendor/rot';
import Game from '../game';

function isPassable(x, y){
	return !['wall','sky'].includes(Game.map.get(x, y).type);
}

class BasicAI {
	constructor(){
		
	}
	run(actor){
		
	}
}

export { BasicAI };