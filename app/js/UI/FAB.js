class FAB{
	constructor(){
		this.icon = null;
		this.label = null;
		this.color = null;
		this.event = null;
	}

	set(o){
		this.icon = o.icon;
		this.label = o.label || null;
		this.color = o.color || null;
		this.event = o.event || null;
		return this;
	}

	addEventListener(){
		if(this.event && document.getElementById("fab")){
			document.getElementById("fab").addEventListener("click", this.event);
		}
	}

	show(){
		if(!document.getElementById("fab")){
			this.render();
			setTimeout(()=> {
				document.querySelector(".fab-icon-container").classList.remove("start");
				this.addEventListener();
			}, 150);
		}
	}

	hide(){
		if(document.getElementById("fab")){
			document.querySelector(".fab-icon-container").classList.add("start");
			setTimeout(()=> {
				if(document.getElementById("fab")){
					document.body.removeChild(document.getElementById("fab"));
				}
			}, 150);
		}
	}


	render(){
		let fab = document.createElement('div');
		fab.className = 'fab-container';
		fab.id = "fab";

		fab.innerHTML = `
		<div class="fab-icon-container start" title="${this.label ? this.label : ""}" style="background-color:${this.color ? this.color : "#E91E63"};">
			<div class="fab-icon">${this.icon}</div>
		</div>
		`

		document.body.appendChild(fab);
	}
}