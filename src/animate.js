import bus from '../vendor/eventbus.min';

import Game from './game';

export default function animate(glyphs, ...frames){
  let tiles = [];
  let index = 0;
  let cleanup = 0;
  let done = false;
  let step = function(dt){
    if(index < frames.length){
      for(let instr of frames[index]){
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
      requestAnimationFrame(step);
    } else if (cleanup < tiles.length){
      bus.dispatch('resetTile', this, ...tiles[cleanup]);
      cleanup++;
      requestAnimationFrame(step);
    }
  }
  Game.engine.lock();
  requestAnimationFrame(step);
  Game.engine.unlock();
}
