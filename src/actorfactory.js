import Actor from './actor';
import Actors from './actors';

export default {
  createActor(id, x, y){
    return new Actor(
      Actors[id].name,
      x,
      y,
      Actors[id].glyph.copy(),
      new Actors[id].controller()
    );
  },
  createActors(id, picker, n){
    let picks = [];
    let actors = [];
    let i = 0;
    while (!picker.empty() && i < n) {
      let pick = picker.pick();
      let [x, y] = [pick.x, pick.y];
      if(!Number.isNaN(x) && !Number.isNaN(y)){
        actors.push(this.createActor(id, x, y));
        picks.push({x: x, y: y});
        i++;
      }
    }
    picks.forEach(p => picker.put(p));
    return actors;
  }
}
