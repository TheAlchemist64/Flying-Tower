import Actor from '../actor';
import Game from './../game';

export default class Monster extends Actor{
	constructor(name, x, y, glyph, ai){
		super(name, x, y, glyph);
		this.ai = ai;
	}
	act(){
		this.ai.run(this);
	}
}