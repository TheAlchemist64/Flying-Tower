import ROT from "../../vendor/rot"

if(!ROT.isSupported()){
	alert("The rot.js library isn't supported by your browser.");
}
else{
	var display = new ROT.Display({width: 50, height: 25});
	document.body.appendChild(display.getContainer());
}