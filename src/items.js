import Glyph from './glyph';

export default {
  EXIT_KEY: {
    name: 'Golden Idol',
    type: 'exit_key',
    glyph: new Glyph('i', 'gold'),
    event: 'revealExit',
  },
  WIND_RUNE: {
    name: 'Wind Rune',
    type: 'rune',
    glyph: new Glyph('w', 'skyblue'),
    event: {
      type: 'attack',
      name: 'windAttack'
    }
  }
}
