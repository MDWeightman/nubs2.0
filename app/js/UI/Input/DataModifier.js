class DataModifier{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.label  = o ? o.label || null : null;
		this.fields = new DataModifierFields();
		this.onAdd = o ? o.onAdd || function(){} : function(){}
		this.data = o ? o.data || null : null;
		this.toolbar = o ? o.toolbar || null : null;
	}
	
	addField(field){
		field.id = `${this.id}_input_${this.fields.items.length}`
		field.button = this.id + '_button';
		this.fields.addField(field);
		return this;
	}

	clear(){
		this.fields = new DataModifierFields();
	}

	focus(){	
		setTimeout(()=>{
			this.fields.items[0].focus();
		},500);
	}
	
	setFieldsFromRow(row){
		this.fields.setFieldsFromRow(row, document.getElementById(this.id+"_button"));
	}

	addEventListener(){
		setTimeout(()=>{
			if(document.getElementById(this.id+'_button')){
				document.getElementById(this.id+'_button').addEventListener("click",(event)=>{
					event.stopImmediatePropagation();
					event.stopPropagation();
					this.onAdd();
					this.fields.clear();
					Application.render();
				});
				this.fields.addEventListeners();
			}
		},500);
		return this;
	}

	render(){
		if(this.fields.items.length == 0){
			return '';
		}
		this.addEventListener();
		return `
		<div class="data-modifier-container">
			<div class="data-modifier-button-container">
				${this.fields.render()}
				<div class="data-modifier-button" id="${this.id}_button">${this.label}</div>
			</div>
		</div>`
	}
}

class DataModifierFields{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.items = o ? o.items || [] : [];
	}

	clear(){
		for(let i = 0; i < this.items.length; i++){
			 this.items[i].clearField();
		}
	}

	clearFields(){
		this.items = [];
	}

	addField(field){		
		let add = true;
		for(let i = 0; i < this.items.length; i++){
			if(field.name == this.items[i].name){
				add = false;
			}
		}
		if(add){
			if(field.constructor.name != "DataModifierField"){
				field = new DataModifierField(field);
			}
			this.items.push(field);
		}
		return this;
	}

	setFieldsFromRow(row, button){
		for(let i = 0; i < this.items.length; i++){
			let item = this.items[i];
			let col = row.columns[i];
			let id = item.input ? item.input.id : item.id;
			if(item.input){
				item.input.value = col.value;
				item.input.reRender();
			}
			else{
				item.value = col.value;
				document.getElementById(id).value = col.value;
			}
		}
		button.innerHTML = "EDIT";
	}

	addEventListeners(){
		for(let i = 0; i < this.items.length; i++){
			this.items[i].addEventListener();
		}
	}

	render(){
		let HTML = ''
		for(let i = 0; i < this.items.length; i++){
			HTML += this.items[i].render();
		}
		return HTML;
	}
}

class DataModifierField{
	constructor(o){
		this.id = o ? o.id : Utils.makeKey(5);
		this.name = o ? o.name || null : null;
		this.button = o ? o.button || null : null;
		this.value = o ? o.value || null : null;
		this.input = o ? o.input || null : null;
		this.style = o ? o.style || null : null;
		this.placeholder = o ? o.placeholder || null : null;
	}

	addEventListener(){
		if(this.button && document.getElementById(this.id)){
			document.getElementById(this.id).addEventListener("keyup",()=>{
				if(this.input){
					this.value = this.input.value;
				}
				else{
					this.value = document.getElementById(this.id).value;
				}
				if(event.keyCode == 13){
					document.getElementById(this.button).click();
				}
			});
		}
	}

	focus(){
		let id = this.input ? this.input.id : this.id;
		document.getElementById(id).focus();
	}

	clearField(){
		if(this.input){
			this.input.clear();
		}
		else{
			this.value = "";
			if(document.getElementById(this.id)){
				document.getElementById(this.id).value = "";
			}		
		}
	}

	render(){
		if(this.input){
			return `
			<div class="data-input-container">
				${this.input.render()}
			</div>`
		}
		return `
		<div class="data-input-container" style="${this.style ? this.style : ""}">
			<input class="data-input" id="${this.id}" placeholder="${this.placeholder ? this.placeholder : ""}" type="text" value="${this.value ? this.value : ""}" />
		</div>`
	}
}

class DataModifierToolbar{
	constructor(o){
		this.id = o ? o.id : Utils.makeKey(5);
		this.actions = o ? new DataModifierToolbarActions(o) : new DataModifierToolbarActions();
	}

	addAction(action){
		if(action.constructor.name != "DataModifierToolbarAction"){
			action = new DataModifierToolbarAction(action);
		}
		this.actions.items.push(action);
		return this;
	}

	addEventListeners(){
		setTimeout(()=>{
			this.actions.addEventListeners();
		},500);
	}

	render(){
		this.addEventListeners();
		return `
		<div class="data-toolbar">
			<div class="data-toolbar-actions">
				${this.actions.render()}
			</div>
		</div>`
	}
}

class DataModifierToolbarActions{
	constructor(o){
		this.id = o ? o.id : Utils.makeKey(5);
		this.items = o ? o.actions || [] : [];
	}

	addEventListeners(){
		for(let i = 0; i < this.items.length; i++){
			this.items[i].addEventListener();
		}
	}

	render(){
		let HTML = '';

		for(let i = 0; i < this.items.length; i++){
			HTML += this.items[i].render();
		}

		return HTML;
	}

}

class DataModifierToolbarAction{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.label = o ? o.label || null : null;
		this.icon = o ? o.icon || null : null;
		this.event = o ? o.event || null : null;
	}

	addEventListener(){
		if(document.getElementById(this.id)){
			document.getElementById(this.id).addEventListener("click", this.event);
		}
	}

	render(){
		return `
		<div class="data-toolbar-action" id="${this.id}" title="${this.label}">
			${this.icon}
		</div>`
	}
}