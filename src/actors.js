import Glyph from './glyph';

import PlayerController from './controllers/player';
import SentinelController from './controllers/sentinel';

export default {
  PLAYER: {
    name: 'Player',
    glyph: new Glyph('@','#fff'),
    controller: PlayerController
  },
  SENTINEL: {
    name: 'Sentinel',
    glyph: new Glyph('s','grey'),
    controller: SentinelController
  }
}
