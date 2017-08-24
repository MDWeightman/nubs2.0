class Menu{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.container = o ? o.container || null : null;
		this.label = o ? o.label || null : null;
		this.labelStyle = o ? o.labelStyle || null : null;
		this.labelTextStyle = o ? o.labelTextStyle || null : null;
		this.selected = o ? o.selected || null : null;
		this.changed = false;
		this.options = o ? o.options || null : null;
		this.style = o ? o.style || null : null;
		this.optionsStyle = o ? o.optionsStyle || null : null;
		this.dark = o ? o.dark || false : false;
		this.icon = o ? o.icon || null : null;
	}

	openMenu(event){
		UI.closeMenus(event);
		event.stopPropagation();
		var options = document.getElementById(this.id+"_options");
		options.classList.remove("hidden");
		setTimeout(()=>{
			options.classList.add("active");
		},150);
	}

	closeMenu(){
		var options = document.getElementById(this.id+"_options");
		if(options){
			options.classList.remove("active");
			setTimeout(()=>{
				options.classList.add("hidden");
				this.render();
			},150);
		}
	}

	isSelectedAnOption(){
		return this.getSelected();
	}

	getSelected(){
		return this.getOption(this.selected);
	}

	getLabel(){
		if(this.getSelected() != null){
			return this.getSelected().getLabel();
		}
		return "";
	}

	getOption(value){
		return this.options.getItem(value);
	}

	setSelected(selected){
		this.selected = selected;
		this.changed = true;
		setTimeout(()=>{
			this.changed = false;
		},700);
		this.closeMenu();
	}

	setEventListeners(){
		setTimeout(()=>{
			if(document.getElementById(this.id)){
				document.getElementById(this.id).addEventListener("click", this.openMenu);
				this.options.addEventListeners();
			}
		},300);
	}

	render(){
		let HTML = '';
		if(this.options && this.options.items.length > 0){
			HTML += `
			<div class="menu ${this.dark ? "dark" : ""}" id="menu-${this.id}" style="${this.style ? this.style : ""}">
				<div class="menu-label ${this.icon ? "icon" : ""}" id="${this.id}" style="${this.labelStyle ? this.labelStyle : ""}">
					<div class="menu-label-text" style="${this.labelTextStyle ? this.labelTextStyle : ""}">${this.getSelected() ? this.getLabel() : ""}</div>
					<div class="menu-label-icon">${this.icon ? this.icon : Constants.SVG.MARK_DOWN}</div>
				</div>
				<div class="menu-options hidden" id="${this.id}_options" style="${this.optionsStyle ? this.optionsStyle : ""}">`
					HTML += this.options.render(this.selected);
				HTML += `</div>`
			HTML += `</div>`

			if(this.container){
				document.getElementById(this.container).innerHTML = HTML;
			}
			else{
				let e = document.getElementById(this.id);
				if(e){
					e.parentElement.parentElement.innerHTML = HTML;
				}
			}
			this.setEventListeners();
		}
		return HTML;
	}
}

class MenuGroup{
	constructor(o){
		this.label = o ? o.label || null : null;
		this.options = new MenuOptions(o.items);
		//this.items = o ? o.items || [] : [];
	}

	addItem(item){
		this.options.addItem(item);
		return this;
	}

	getItem(value){
		return this.options.getItem(value);
	}

	getItemLabel(value){
		let item = this.getItem(value);
		if(item){
			return item.label
		}
		return "";
	}

	addEventListeners(){
		this.options.addEventListeners();
	}

	render(selected){
		let HTML = `
		<div class="menu-group">`
			if(this.label){
				HTML += `
				<div class="menu-group-label">
					<div class="menu-group-label-text">${this.label}</div>
				</div>`
			}
			HTML += this.options.render(selected);
		HTML +=`</div>`
		return HTML;
	}
}

class MenuOptions{
	constructor(o){
		this.items = o || [];
	}

	addItem(item){
		if(item.constructor.name != "MenuOption"){
			item = new MenuOption(item);
		}
		this.items.push(item);
		return this;
	}

	addGroup(group){
		if(group.constructor.name != "MenuGroup"){
			group = new MenuGroup(group);
		}
		this.items.push(group);
		return group;
	}

	addEventListeners(){
		for(let i = 0; i < this.items.length; i++){
			let item = this.items[i];
			if(item.event){
				if(document.getElementById(item.id)){
					document.getElementById(item.id).addEventListener("click", item.event);
				}
			}
		}
	}

	getItem(value){
		let item = null;
		for(let i = 0; i < this.items.length; i++){
			if(!item){
				if(this.items[i].constructor.name == "MenuGroup"){
					item = this.items[i].getItem(value);
				}
				else{
					if(this.items[i].value == value){
						return this.items[i];
					}
				}
			}
		}
		return item;
	}

	getItemLabel(value){
		let item = this.getItem(value);
		if(item){
			return item.label
		}
		return "";
	}

	addEventListeners(){
		for(let i = 0; i < this.items.length; i++){
			let item = this.items[i];
			if(item.constructor.name == "MenuGroup"){
				item.addEventListeners();
			}
			else{
				if(item.event){
					document.getElementById(item.id).addEventListener("click", item.event);
				}
			}
		}
	}

	render(selected){
		let HTML = '';

		for(let i = 0; i < this.items.length; i++){
			HTML += this.items[i].render(selected);
		}

		return HTML;
	}
}

class MenuOption{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.label = o ? o.label || null : null;
		this.key = o ? o.key || null : null;
		this.keyStyle = o ? o.keyStyle || null : null;
		this.value = o ? o.value == 0 ? 0 : o.value || null : null;
		this.style = o ? o.style || null : null;
		this.event = o ? o.event || null : null;
		this.ignore = o ? o.ignore || false : false;
	}

	getLabel(){
		return `${this.label}${this.key ? ` - ${this.key}`: ""}`
	}

	render(selected){
		if(this.label && !this.ignore){
			return `
			<div id="${this.id}" class="menu-option ${selected == this.value ? "selected" : ""}" data-value="${this.value}" style="${this.style ? this.style : ""}">
				<div class="menu-option-text"><div class="menu-option-text-label">${this.label}</div>${this.key ? `<div class="menu-option-text-key" style="${this.keyStyle ? this.keyStyle : ""}">${this.key}</div>` : ""}</div>
			</div>`
		}
		return '';
	}
}