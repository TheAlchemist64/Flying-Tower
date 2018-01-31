import ROT from '../vendor/rot';
import bus from '../vendor/eventbus.min';

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

export function checkCollision(x, y) {
  let obj = null;
  Game.actors.forEach(actor => {
    if(x == actor.x && y == actor.y){
      obj = actor;
    }
  });
  return obj;
}

export function betweenPlayerAndExit(x, y){
  let dx = Game.map.exit[0] - Game.player.x;
  let dy = Game.map.exit[1] - Game.player.y;
  let innerProduct = (x - Game.player.x) * dx + (y - Game.player.y) * dy;
  return 0 <= innerProduct && innerProduct <= dx*dx + dy*dy;
}

export function getPathToExit(){
  let astar = new ROT.Path.AStar(Game.map.exit[0], Game.map.exit[1], passable, {topology: 4});
  let path = [];
  astar.compute(Game.player.x, Game.player.y, (x, y) => {
    path.push([x, y]);
  });
  return path;
}

export function tileEvent(type, actor, x, y) {
	switch(type){
		case 'sky':
			if(actor.hasItem('Earth Rune')){
				bus.dispatch('skyStep', actor, x, y);
				return true;
			}
			break;
		case 'exit':
			bus.dispatch('exit', actor);
			return false;
			break;
	}
}
