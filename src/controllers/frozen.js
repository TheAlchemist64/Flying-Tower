import Controller from '../controller';

let actors = [];
export function isFrozen(actor) {
  return actors.includes(actor);
}

export default class FrozenController extends Controller {
  constructor(time, controller){
    super();
    this.time = time;
    this.prev = controller;
  }
  run(actor){
    super.run(actor);
    if (!isFrozen(actor)) {
      actor.glyph.fg = 'skyblue';
      for (var i = 0; i < this.time; i++) {
        actor.glyph.chr = i + 1;
      }
      actors.push(actor);
    }
    else{
      this.time--;
      actor.glyph.back();
      if(this.time == 0){
        actor.glyph.back(); //Remove fg change
        actor.controller = this.prev;
        let index = actors.indexOf(actor);
        actors.splice(index, 1);
        actor.controller.run(actor);
      }
    }
    actor.draw();
  }
}
