class Grid{
	constructor(o){
		this.columns = o ? o.columns || null : null;
		this.items = [];
	}

	addItem(item){
		if(item.constructor.name != "GridItem"){
			item = new GridItem(item);
		}
		item.grid = this;
		this.items.push(item);
		return item;
	}

	getItem(id){
		for(let i = 0; i < this.items.length; i++){
			if(this.items[i].id == id){
				return this.items[i];
			}
		}
		return null;
	}

	getItemIndex(id){
		for(let i = 0; i < this.items.length; i++){
			if(this.items[i].id == id){
				return i;
			}
		}
		return null;
	}

	deleteItem(item){
		let index = this.getItemIndex(item.id);
		if(index || index == 0){
			this.items.splice(index, 1);
		}
		Application.Screen.render();
	}

	render(){
		let HTML = '';
		for(let i = 0; i < this.items.length; i++){
			HTML += this.items[i].render();
		}
		return `
		<div class="grid">
			${HTML}
		</div>`
	}

}

class GridItem{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.grid = o ? o.grid || null : null;
		this.value = o ? o.value || null : null;
		this.input = o ? o.input || null : null;
		this.style = o ? o.style || null : null;
	}

	delete(){
		this.grid.deleteItem(this);
	}

	addEventListener(){
		setTimeout(()=>{
			if(document.getElementById(`${this.id}-action`)){
				document.getElementById(`${this.id}-action`).addEventListener("click", ()=>{
					this.delete();
				});
			}
		}, 500);
	}

	focus(){
		setTimeout(()=>{
			if(this.input && document.getElementById(this.id)){
				this.input.focus();
			}
		}, 500);
	}

	render(){
		this.addEventListener();
		return `
		<div class="grid-item" id="${this.id}" style="${this.style ? this.style : ""}">
			<div class="grid-item-content">
				${this.input ? this.input.render() : this.value}
			</div>
			<div class="grid-item-action-container" title="Delete" id="${this.id}-action">
				<div class="grid-item-action">
					${Constants.SVG.DELETE}
				</div>
			</div>
		</div>`
	}

}