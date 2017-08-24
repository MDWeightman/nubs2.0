class _UI{
	constructor(){
		this.Appbar = new Appbar();
		this.FAB = new FAB();
		this.Dialog = new Dialog();
		this.Sidebar = new Sidebar();
		this.Toolbar = new Toolbar();
	}

	closeMenus(event){
		let target = event.currentTarget;
		let id = (target.id == "" ? target.parentElement.id : target.id )+'_options';
		document.querySelectorAll('.menu-options').forEach(function(m){
			if(m.id != id){
				m.classList.remove("active");
				setTimeout(()=>{
					m.classList.add("hidden");
				},150);
			}
		});
		if(document.documentElement.clientWidth <= 960){
			UI.Sidebar.close(event);
		}
	}

	addEventListeners(){
		document.body.removeEventListener('click', this.closeMenus);
		document.body.addEventListener('click', this.closeMenus);
	}

	render(){
		this.Appbar.render();
		this.Sidebar.render();
		this.Toolbar.render();
		this.addEventListeners();
	}
}

let UI = new _UI();

document.getElementById("content").addEventListener("scroll", function(event){
	if(event.target.scrollTop > 40){
		document.getElementById("appbar-title").classList.add("active");
		UI.FAB.set({
			label: 'Scroll to Top',
			icon: Constants.SVG.ARROW_ADVANCE,
			event: ()=>{
				document.getElementById("content").scrollTop = 0;
			}
		}).show();
	}
	else{
		document.getElementById("appbar-title").classList.remove("active");
		UI.FAB.hide();
	}
});