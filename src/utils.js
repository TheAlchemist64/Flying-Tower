import Game from './game';

export function passable(x, y) {
  let t = Game.map.get(x, y);
  if(!t) return false;
  return t.type != "sky";
}
