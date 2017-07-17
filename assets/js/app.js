import ROT from "../../vendor/rot"
import Game from './game'
import { Tile } from './tile';

if(!ROT.isSupported()){
	alert("The rot.js library isn't supported by your browser.");
}
else{
	Game.init();
}