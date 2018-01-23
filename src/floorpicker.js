import ROT from '../vendor/rot';
import PriorityQueue from '../vendor/priority-queue.min';

let queue = new PriorityQueue({
  comparator: (a,b) => Math.floor(ROT.RNG.getUniform() * 3) - 1
});

export default {
  empty(){
    return queue.length == 0;
  },
  pick() {
    return queue.dequeue();
  },
  put(tile) {
    queue.queue(tile.x+','+tile.y);
  },
  setMap(map){
    queue.clear();
    Array.from(map.tiles.values()).filter(
      tile => tile.type == "floor"
    ).forEach(tile => this.put(tile));
  }
}
