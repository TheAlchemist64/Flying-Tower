import Controller from '../controller';

export default class FrozenController extends Controller {
  constructor(time, prev){
    this.time = time;
    
    this.prev = prev;
  }
  run(actor){
    super.run(actor);
    if(this.time > 0){
      this.time--;
      actor.glyph.back();
    }
    else{
      actor.controller = this.prev;
    }
    actor.draw();
  }
}
