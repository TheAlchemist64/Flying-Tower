import ROT from '../vendor/rot';
import PriorityQueue from '../vendor/priority-queue.min';

export default {
  queue: new PriorityQueue({
  	comparator: (a,b) => Math.floor(ROT.RNG.getUniform() * 3) - 1
  }),
  empty(){
    return this.queue.length == 0;
  },
  pick() {
    return this.queue.dequeue();
  },
  put(tile) {
    this.queue.queue(tile.x+','+tile.y);
  },
  setMap(map){
    this.queue.clear();
    Array.from(map.tiles.values()).filter(
      tile => tile.type == "floor"
    ).forEach(tile => this.put(tile));
  }
}
