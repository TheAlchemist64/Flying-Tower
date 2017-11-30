import ROT from '../vendor/rot';

import Game from './game';

export function passable(x, y) {
  let t = Game.map.get(x, y);
  if(!t) return false;
  return t.type != "sky";
}

export function distance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

export function randInt(a, b){
	return a + Math.floor((b-a) * ROT.RNG.getUniform());
}
