class Toolbar{
	constructor(){
		this.title = "";
		this.titleContainer = document.getElementById("toolbar-title-text");
		this.appbarTitleContainer = document.getElementById("appbar-title-text");
		this.tabs = new ToolbarTabs();
		this.tabsContainer = document.getElementById("toolbar-tabs");
		this.actions = new ToolbarActions();
		this.actionsContainer = document.getElementById("toolbar-actions");
	}

	setTitle(title){
		this.title = title;
		this.renderTitle();
	}

	setActions(actions){
		this.actions = new ToolbarActions();
		for(var i = 0; i < actions.length; i++){
			this.actions.addAction(actions[i]);
		}
	}

	clear(){
		this.tabs.clear();
		this.actions = new ToolbarActions();
	}

	addAction(action){
		this.actions.addAction(action);
	}

	removeAction(action){
		this.actions.removeAction(action);
	}

	addTab(tab){
		this.tabs.addTab(tab);
	}

	renderTitle(){		
		this.titleContainer.innerHTML = this.title;
		this.appbarTitleContainer.innerHTML = this.title;
	}

	renderTabs(){		
		this.tabsContainer.innerHTML = this.tabs.render();
	}

	render(){
		this.renderTitle();
		this.renderTabs();
		this.actionsContainer.innerHTML = this.actions.render();
	}
}

class ToolbarTabs{
	constructor(){
		this.items = [];
		this.selected = null;
	}

	clear(){
		this.items = [];
		this.selected = null;
	}

	addTab(tab){
		if(tab.constructor.name != "ToolbarTab"){
			tab = new ToolbarTab(tab);
		}
		if(tab.selected){
			this.selected = tab.id;
		}
		this.items.push(tab);
	}

	getTab(value){
		for(var i = 0; i < this.items.length; i++){
			if(this.items[i].value == value){
				return this.items[i];
			}
		}
		return null;
	}

	getTabIndex(id){
		for(var i = 0; i < this.items.length; i++){
			if(this.items[i].id == id){
				return i;
			}
		}
		return null;
	}

	getTabById(id){
		for(var i = 0; i < this.items.length; i++){
			if(this.items[i].id == id){
				return this.items[i];
			}
		}
		return null;
	}

	getSelected(){
		return this.getTabById(this.selected);
	}

	selectTab(value){
		this.selected = this.getTab(value).id;
	}

	selectTabById(id){
		this.selected = id;
	}

	selectTabByIndex(index){
		this.selected = this.items[index].id;
	}

	run(id){
		let tab = this.getTabById(id);
		if(tab.event){
			tab.event();
		}
	}

	render(){
		let HTML = '';
		
		for(let i = 0; i < this.items.length; i++){
			HTML += this.items[i].render(this.selected);
		}

		return HTML;
	}

}

class ToolbarTab{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.label = o.label || null;
		this.value = o.value || null;
		this.selected = o.selected || null;
		this.icon = o.icon || null;
		this.menu = o.menu || null;
		this.event = o.event || null;
	}

	render(selected){
		return `<div id="tab-${this.id}" class="toolbar-tab-item ${this.id == selected ? "selected" : ""}" onclick="UI.Toolbar.tabs.run('${this.id}');">${this.label ? this.label : ""}${this.menu ? this.menu.render() : ""}</div>`
	}

}

class ToolbarActions{
	constructor(){
		this.items = [];
	}

	addAction(action){
		if(action.constructor.name != "ToolbarAction"){
			action = new ToolbarAction(action);
		}
		this.items.push(action);
	}

	removeAction(action){
		this.items.splice(this.getActionIndex(action.id), 1);
	}

	getAction(id){
		for(var i = 0; i < this.items.length; i++){
			if(this.items[i].id == id){
				return this.items[i];
			}
		}
		return null;
	}

	getActionIndex(id){
		for(var i = 0; i < this.items.length; i++){
			if(this.items[i].id == id){
				return i;
			}
		}
		return null;
	}

	run(id){
		let action = this.getAction(id);
		if(action.event){
			action.event();
		}
	}

	clear(){
		this.actions = [];
	}

	render(){
		let HTML = '';
		
		for(let i = 0; i < this.items.length; i++){
			HTML += this.items[i].render();
		}

		return HTML;
	}

}


class ToolbarAction{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.menu = o.menu || null;
		this.label = o.label || null;
		this.icon = o.icon || null;
		this.event = o.event || null;
	}

	spin(){
		document.getElementById(this.id).classList.add("spin");
	}

	render(){
		if(this.menu){
			return `
			<div class="toolbar-action-item-menu">
				${this.menu.render()}
			</div>
			`		
		}
		return `
		<div id="${this.id}" class="toolbar-action-item" title="${this.label}">
			<div class="toolbar-action-item-icon" onclick="UI.Toolbar.actions.run('${this.id}');">${this.icon}</div>
		</div>
		`
	}

}