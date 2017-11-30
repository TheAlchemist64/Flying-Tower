import Item from './item';
import Items from './items';

export default {
  createItem(id, map, x, y){
    let item = new Item(
      Items[id].name,
  		Items[id].glyph,
  		Items[id].event,
  		Items[id].slot,
  		x,
      y
    );
    if(map){
      map.dropItem(item);
    }
    return item;
  }
}
