import bus from '../vendor/eventbus.min';

import Game from './game';
import Glyph from './glyph';
import Tile from './map/tile';
import TileTypes from './map/tiletypes';
import animate from './animate';
import FrozenController, { isFrozen } from './controllers/frozen';

export default {
  revealExit(e, x, y){
    Game.map.exitRevealed = true;
    Game.map.set(new Tile(Game.map.exit[0], Game.map.exit[1], TileTypes.EXIT));
    Game.map.draw();
    Game.map.floors[x+','+y] = true;
  },
  windAttack(e, actor, dx, dy){
    let x = actor.x;
    let y = actor.y;
    actor.move(actor.x + dx * 2, actor.y + dy * 2, e.target, true);
    animate({
      impact: new Glyph('o', 'skyblue'),
      hTrail: new Glyph('-', 'skyblue'),
      vTrail: new Glyph('|', 'skyblue')
    },
    {
      draw:[
        {
          glyph: actor.glyph,
          x: x + dx,
          y: y + dy
        },
        {
          glyph: 'impact',
          x: x,
          y: y,
          reset: true
        }
      ],
      delay: 50
    },
    {
      draw: [
        {
          glyph: actor.glyph,
          x: x + dx * 2,
          y: y + dy * 2,
          resetIf: () => actor.dead
        },
        {
          glyph: 'hTrail',
          x: x + dx,
          y: y + dy,
          reset: true,
          condition: () => dy == 0,
        },
        {
          glyph: 'vTrail',
          x: x + dx,
          y: y + dy,
          reset: true,
          condition: () => dx == 0
        }
      ],
      delay: 50
    });
  },
  freezeAttack(e, actor){
    if (!isFrozen(actor)) {
      actor.controller = new FrozenController(5, actor.controller);
    }
  },
  skyStep(e, x, y){
    let tile = new Tile(x, y, TileTypes.FLOOR);
    Game.map.set(tile);
    tile.draw();
  }
}
