import Game from './game';

export class Being {
	constructor(name, x, y){
		this.name = name;
		this.x = x;
		this.y = y;
	}
	act(){}
}

export class Player extends Being{
	
}