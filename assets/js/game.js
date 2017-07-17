import ROT from '../../vendor/rot'

export default {
	display: null,
	
	init: function(){
		this.display = new ROT.Display({width: 50, height: 25});
		document.body.appendChild(this.display.getContainer());
	}
}