import bus from '../vendor/eventbus.min';

import Game from './game';

export default class Timer {
  constructor(count, f) {
    this.count = count;
    this.f = f;
    this.activated = false;
  }
  activate(){
    Game.scheduler.add(this, true);
    this.activated = true;
  }
  act(){
    if(this.activated){
      if (this.count > 0) {
        this.count--;
        bus.dispatch('tickTimer', this);
      }
      else{
        this.f();
        Game.scheduler.remove(this);
      }
    }
    else{
      throw new console.error("Timer has not been activated.");
    }
  }
}
