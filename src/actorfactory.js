import Actor from './actor';
import Actors from './actors';
import Decorator from './decorator';

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
  createActors(id, n){
    let picks = [];
    let actors = [];
    let i = 0;
    while (!Decorator.empty() && i < n) {
      actors.push(this.createActor(id, ...Decorator.pick()));
      i++;
    }
    return actors;
  }
}
