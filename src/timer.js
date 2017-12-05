import bus from '../vendor/eventbus.min';
import Game from './game';

export default class Timer {
  constructor(name, count, f) {
    this.name = name;
    this.count = count;
    this.callbacks = [];
    if(f){
      this.then(f);
    }
    this.activated = false;
  }
  then(f){
    if(f instanceof Timer){
      this.callbacks.push(() => {
        f.activate();
        bus.dispatch('tickTimer', f);
      });
    }
    else{
      this.callbacks.push(f);
    }
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
      this.callbacks.forEach(f => f());
      Game.scheduler.remove(this);
    }
  }
}
