import ROT from '../../vendor/rot';

import { distance, isFloor } from '../utils';
import Game from '../game';
import Controller from '../controller';

export default class SentinelController extends Controller {
  run(actor){
    super.run(actor);
    //Initialize pathfinder
    let finder = new ROT.Path.AStar(Game.player.x, Game.player.y, isFloor, {topology:4});
    //Find path from AI to player
    let path = [];
    finder.compute(actor.x, actor.y, (x, y)=>{
      path.push({x: x, y: y});
    });
    if(path.length <= 5){
      //Change color
      if(actor.glyph.fg != 'red'){
        actor.glyph.fg = 'red';
      }
      //Move onto player's tile
      if(path.length > 1){
  			actor.move(path[1].x, path[1].y);
  		}
    }
    else{
      actor.glyph.back();
    }
    //actor.draw();
    if(!Game.player.dead){
      Game.player.controller.drawFOV();
      Game.player.draw();
    }
  }
}
