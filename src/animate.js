import bus from '../vendor/eventbus.min';

import Game from './game';

export default function animate(glyphs, frames){
  let tiles = [];
  let draw = function(glyph, x, y){
    glyphs[glyph].draw(x, y);
    tiles.push([x, y]);
  }
  let index = 0;
  let done = false;
  let step = function(dt){
    if(index < frames.length){
      frames[index](draw);
      index++;
      requestAnimationFrame(step);
    } else if (index - frames.length < tiles.length){
      bus.dispatch('resetTile', this, ...tiles[index - frames.length]);
      requestAnimationFrame(step);
    }
  }
  Game.engine.lock();
  requestAnimationFrame(step);
  Game.engine.unlock();
}
