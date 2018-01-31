import Glyph from './glyph';
import TileTypes from './map/tiletypes';

import PlayerController from './controllers/player';
import SentinelController from './controllers/sentinel';

export default {
  PLAYER: {
    name: 'Player',
    glyph: TileTypes.PLAYER,
    controller: PlayerController
  },
  SENTINEL: {
    name: 'Sentinel',
    glyph: TileTypes.SENTINEL,
    controller: SentinelController
  }
}
