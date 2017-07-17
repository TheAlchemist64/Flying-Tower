export default class Enum{
	constructor(){
		let args = Array.prototype.slice.call(arguments);
		let i = 0;
		args.forEach((val)=>{
			this[val] = i++;
		});
		Object.freeze(this);
	}
}