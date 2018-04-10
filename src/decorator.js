import ROT from '../vendor/rot';
import PriorityQueue from '../vendor/priority-queue.min';

function createQueue(room){
  let tiles = [];
  for(let x = room.getLeft() + 1; x < room.getRight(); x++){
    for(let y = room.getTop() + 1; y < room.getBottom(); y++){
      let isDoor = false;
      room.getDoors((dX, dY) => {
        if(x==dX && y==dY){
          isDoor = true;
        }
      });
      if(!isDoor){
        tiles.push([x, y]);
      }
    }
  }
  return new PriorityQueue({
    comparator: (a,b) => Math.floor(ROT.RNG.getUniform() * 3) - 1,
    initialValues: tiles
  });
}

export default {
  rooms: [],
  index: 0,
  setRooms(rooms){
    rooms.forEach(room => this.rooms.push(createQueue(room)));
  },
  pick(){
    return this.rooms[(this.index++) % this.rooms.length].dequeue();
  },
  put(x, y, index){
    this.rooms[index].queue([x, y]);
  },
  empty(){
    return !this.rooms.map((queue) => queue.length == 0).includes(false);
  }
}
