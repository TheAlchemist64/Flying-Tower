export default class Controller {
	run(actor){
		if(this.state=="stunned"){
			this.stunned--;
			if(this.stunned > 0){
				this.glyph.chr = this.stunned;
			}
			else{
				this.state = "immune";
				this.immune = 1;
				this.glyph.chr = "*";
			}
			this.draw();
		}
		else if(this.state=="immune"){
			this.immune--;
			if(!this.immune){
				this.state = "active";
				this.glyph.chr = this._chr;
				delete this._chr;
				this.glyph.fg = this._fg;
				delete this._fg;
				this.draw();
			}
		}
	}
}