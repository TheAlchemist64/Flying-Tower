import ROT from '../vendor/rot';
import PriorityQueue from '../vendor/priority-queue.min';

export default {
  rooms: [],
  index: 0,
  createQueue(room){
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
        console.log('tile: ', x, y, 'isDoor: ', isDoor);
      }
    }
    return new PriorityQueue({
      comparator: (a,b) => Math.floor(ROT.RNG.getUniform() * 3) - 1,
      initialValues: tiles
    });
  },
  setRooms(rooms){
    rooms.forEach(room => this.rooms.push(this.createQueue(room)));
  },
  pickTile(room){
    let pos = room.getLeft+','+room.getTop();
    if(!rooms[pos]){
      rooms[pos] = this.createQueue(room);
    }
    if(rooms[pos].length != 0){
      return rooms[pos].dequeue();
    }
    else{
      return null;
    }
  },
  pickCenter(room){
    return room.getCenter();
  },
  pick(){
    return this.rooms[(this.index++) % this.rooms.length].dequeue();
  }
}
