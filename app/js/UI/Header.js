class Header{
	constructor(o){
		this.label = o ? o.label || null : null;
		this.badge =  o ? o.badge == 0 ? 0 : o.badge || null : null;
	}

	render(){
		return `
		<div class="header-label">
			${this.badge != null ? `<div class="header-label-badge">${this.badge}</div>` : ""}
			<div class="header-label-text">${this.label}</div>
		</div>
		`
	}
}