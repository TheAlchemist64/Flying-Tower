import bus from '../vendor/eventbus.min';

import Game from './game';

export default class Timer {
  constructor(name, count, f) {
    this.name = name;
    this.count = count;
    this.f = f;
    this.activated = false;
  }
  activate(){
    if(!this.activated){
      this.activated = true;
      Game.scheduler.add(this, true);
    }
  }
  act(){
    if (this.count > 0) {
      this.count--;
      bus.dispatch('tickTimer', this);
    }
    else{
      this.f();
      Game.scheduler.remove(this);
    }
  }
}
