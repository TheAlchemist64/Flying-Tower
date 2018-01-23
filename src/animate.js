import bus from '../vendor/eventbus.min';

import Game from './game';

class Frame {
  constructor(opts) {
    this.draw = opts.draw;
    if(opts.delay){
      this.delay = opts.delay;
    }
  }
}

export default function animate(glyphs, ...frames){
  frames = frames.map(opts => new Frame(opts));
  let tiles = [];
  let index = 0;
  let cleanup = 0;
  let done = false;
  let count = 0;
  let lastframe = performance.now();
  let step = function(ts){
    if(index < frames.length){
      count += (ts - lastframe);
	  lastframe = ts;
      if(!frames[index].delay || (frames[index].delay && count >= frames[index].delay)){
        for(let instr of frames[index].draw){
          if(!instr.condition || instr.condition()){
            let x = instr.x;
            let y = instr.y;
            let glyph = null;
            if(typeof instr.glyph == 'string'){
              glyph = glyphs[instr.glyph];
            }
            else{
              glyph = instr.glyph;
            }
            glyph.draw(x, y);
            if(instr.reset || (instr.resetIf && instr.resetIf())){
              tiles.push([x, y]);
            }
          }
        }
        index++;
        count = 0;
      }
      requestAnimationFrame(step);
    } else if (cleanup < tiles.length){
      bus.dispatch('resetTile', this, ...tiles[cleanup]);
      cleanup++;
      requestAnimationFrame(step);
    } else{
      Game.engine.unlock();
    }
  }
  Game.engine.lock();
  requestAnimationFrame(step);
}
