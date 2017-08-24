class BoolInput{
	constructor(o){
		this.id = Utils.makeKey(5);
		this.value = o ? o.value || false : false;
		this.label = o ? o.label || null : null;
		this.style = o ? o.style || null : null;
		this.event = o ? o.event || null : null;
	}

	addEventListener(){
		setTimeout(()=>{
			document.getElementById(this.id).addEventListener("change", ()=>{
				let value = document.getElementById(this.id).checked;
				this.value = value;
				if(this.event){
					this.event();
				}
			});
		},500);
		return this;
	}

	clear(){
		this.value = false;
	}

	check(value){
		document.getElementById(this.id).checked = value;
		this.value = value;
	}

	reRender(){
		document.getElementById(this.id).parentElement.parentElement.innerHTML = this.render();
	}

	render(){
		this.addEventListener();
		return `
		<div class="data-bool-container ${this.label ? "" : "noLabel"}" style="${this.style ? this.style : ""}">
			<input type="checkbox" class="data-bool-checkbox" id="${this.id}" ${this.value ? "checked" : ""} />
			<label for="${this.id}" class="data-bool-label">${this.label}</label>
		</div>`
	}

}