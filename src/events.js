import Game from './game';
import Tile from './map/tile';
import TileTypes from './map/tiletypes';

export default {
  revealExit(e){
    //console.log('revealItem');
    Game.map.exitRevealed = true;
    Game.map.set(new Tile(Game.map.exit[0], Game.map.exit[1], TileTypes.EXIT));
    Game.map.draw();
  }
}
