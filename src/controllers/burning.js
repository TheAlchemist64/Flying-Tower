import Controller from '../controller';
import { randInt } from '../utils';

let actors = [];
export function isBurning(actor) {
  return actors.includes(actor);
}

export default class BurningController extends Controller {
  constructor(time, controller){
    super();
    this.time = time;
    this.prev = controller;
  }
  run(actor){
    super.run(actor);
    if (!isBurning(actor)) {
      actor.glyph.fg = 'orange';
      for (var i = 0; i < this.time; i++) {
        actor.glyph.chr = i + 1;
      }
      actors.push(actor);
      actor.draw();
    }
    else{
      this.time--;
      actor.glyph.back();
      if(this.time == 0){
        actor.glyph.back(); //Remove fg change
        actor.controller = this.prev;
        let index = actors.indexOf(actor);
        actors.splice(index, 1);
      }

      let dirs = [[1,0],[0,1],[-1,0],[0,-1]];
      let move = dirs[randInt(0,4)];
      actor.move(actor.x + move[0], actor.y + move[1], true);
    }
  }
}
