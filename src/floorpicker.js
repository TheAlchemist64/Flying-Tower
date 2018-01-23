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
    if(tile && tile.type!='sky'){
      queue.queue(tile);
    }
  },
  cycle(f){
    this.put(f(this.pick()));
  },
  setMap(map){
    queue.clear();
    Array.from(map.tiles.values()).forEach(tile => this.put(tile));
  }
}
