class Appbar{
	constructor(){
		this.server = new Menu({
			container: 'appbar-server',
			label: 'Server',
			selected: null,
			options: new MenuOptions()
		});			
	}

	enableServer(){
		document.getElementById(`menu-${this.server.id}`).classList.remove("hidden");
	}

	disableServer(){
		document.getElementById(`menu-${this.server.id}`).classList.add("hidden");
	}

	render(){
		this.server.options = new MenuOptions();
		if(User.roles){
			if(User.roles.DEV){	
				this.server.options.addItem({
					label: 'Development',
					value: 'DEV',
					event: ()=>{
						this.server.setSelected('DEV');
						Application.server = 'DEV';
						try{ Application.Screen.current.changeServer(); } catch(err){}
						Application.render();
					}
				});
			}
			if(User.roles.QA){	
				this.server.options.addItem({
					label: 'QA',
					value: 'QAS',
					event: ()=>{
						this.server.setSelected('QAS');
						Application.server = 'QAS';
						try{ Application.Screen.current.changeServer(); } catch(err){}
						Application.render();
					}
				});
			}
			if(User.roles.PRD){	
				this.server.options.addItem({
					label: 'Production',
					value: 'PRD',
					event: ()=>{
						this.server.setSelected('PRD');
						Application.server = 'PRD';
						try{ Application.Screen.current.changeServer(); } catch(err){}
						Application.render();
					}
				});
			}
		}
		if(!this.server.isSelectedAnOption() && this.server.options.items.length > 0){
			this.server.selected = this.server.options.items[0].value;
			Application.server = this.server.selected;
		}

		if(this.server){
			this.server.render();
		}
	}
}