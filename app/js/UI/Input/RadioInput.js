class RadioInputGroup{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.items = [];
		this.value = o ? o.value || null : null;
	}

	addItem(item){ 
		if (item.constructor.name == "Object") {
			item = new RadioInput(item);
		}
		item.groupId = this.id;
		this.items.push(item);
		return this;
	}

	render(){
		return `
		<div id="${this.id}" class="radio-group-container">
			${this.items.map(item=>{
				return item.render(this.value);
			}).join('')}
		</div>`
	}

}


class RadioInput{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.groupId = o.groupId;
		this.label = o.label;
		this.value = o.value;
		this.event = o.event || null;
	}

	addEventListener(){
		if(this.event){
			setTimeout(()=>{
				if(document.getElementById(`${this.id}_item`)){
					document.getElementById(`${this.id}_item`).removeEventListener('click', ()=>{
						this.event();
					});
					document.getElementById(`${this.id}_item`).addEventListener('click', ()=>{
						this.event();
					});
				}
			},1000);
		}
	}

	render(value){
		this.addEventListener();
		return `
		<div id="${this.id}_item" class="radio-group-item">
			<input type="radio" id="${this.id}" name="${this.groupId}" ${this.value == value ? 'checked' : ''} value="${this.value}" />
			<label for="${this.id}">${this.label}</label>
		</div>`
	}
}