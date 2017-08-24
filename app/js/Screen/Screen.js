class Screen{
	constructor(){
		this.current = null;

	}

	set(screen){
		this.current = screen;
		UI.Toolbar.clear();
		Application.workspace.innerHTML = "";
		this.render();
	}

	render(){
		if(this.current){
			this.current.render();
		}
	}
}