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
    try {
      let tile = this.rooms[this.index].dequeue();
      this.index = (this.index+1) % this.rooms.length;
      return tile;
    } catch (err) {
      console.log(err.name + ': ' + err.message);
      console.log(this.rooms);
      console.log(this.index);
    }
  },
  put(x, y, index){
    try {
      this.rooms[index].queue([x, y]);
    } catch (err) {
      console.log(err.name + ': ' + err.message);
      console.log(this.rooms);
      console.log(this.index);
    }
  },
  empty(){
    return !this.rooms.map((queue) => queue.length == 0).includes(false);
  }
}
