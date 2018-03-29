import ROT from '../../vendor/rot';

import { distance, passable } from '../utils';
import Game from '../game';
import Controller from '../controller';

export default class SentinelController extends Controller {
  run(actor){
    super.run(actor);
    if(distance(actor.x, actor.y, Game.player.x, Game.player.y) < 5){
      //Change color
      actor.glyph.fg = 'red';
      //Initialize pathfinder
  		let finder = new ROT.Path.AStar(Game.player.x, Game.player.y, passable, {topology:4});
      //let finder = new ROT.Path.AStar(Game.map.exit[0], Game.map.exit[1], passable, {topology:4});
      //Find path from AI to player
  		let path = [];
  		finder.compute(actor.x, actor.y, (x, y)=>{
  			path.push({x: x, y: y});
  		});
      //Move onto player's tile
      if(path.length > 1){
  			actor.move(path[1].x, path[1].y);
  		}
    }
    else{
      actor.glyph.back();
    }
    actor.draw();
  }
}
