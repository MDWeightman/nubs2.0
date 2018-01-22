class SetupGame {
    constructor(o) {
        this.data = o.data;
        this.title = o.title;
        this.step1 = new SetupGameStep1({
            data: this.data,
            game: this
        });
        this.step2 = new SetupGameStep2({
            data: this.data,
            game: this
        });
    }

    render() {
        return `
		${this.step1.render()}
		${this.step2.render()}`
    }
}

class SetupGameStep1 {
    constructor(o) {
        this.id = Utils.makeKey(5);
        this.game = o.game;
        this.data = o.data;
        this.header = new Header({
            badge: 1,
            label: 'Setup'
        })
		this.sessions = null;
		this.locales = null;
		this.genders = null;
        this.setup();
    }

    setup() {
		this.genders = new RadioInputGroup({
			value: 'ALL'
		});

		
		this.genders.addItem({
			label: 'All',
			value: 'ALL',
			event: ()=>{
				delete this.game.step2.filter.gender;
				this.game.step2.setup();
				this.game.step2.update();
			}
		});
		Users.genders.map(item=>{
			let gender = item;
			this.genders.addItem({
				label: gender,
				value: gender,
				event: ()=>{
					this.game.step2.filter['gender'] = gender;
					this.game.step2.setup();
					this.game.step2.update();
				}
			})
		});

		this.locales = new RadioInputGroup({
			value: 'ALL'
		});
		this.locales.addItem({
			label: 'All',
			value: 'ALL',
			event: ()=>{
				delete this.game.step2.filter.locale;
				this.game.step2.setup();
				this.game.step2.update();
			}
		});
		Users.locales.map(item=>{
			let locale = item;
			this.locales.addItem({
				label: locale,
				value: locale,
				event: ()=>{
					this.game.step2.filter['locale'] = locale;
					this.game.step2.setup();
					this.game.step2.update();
				}
			})
		});

        this.sessions = new TextInput({
            value: '',
            event: () => {
                document.getElementById("sessions-players").innerHTML = this.sessions.value * this.data.players;
                this.game.step2.sessions = Number(this.sessions.value);
                this.game.step2.setup();
                this.game.step2.update();
            }
        });
    }

    update() {
        document.getElementById(this.id).innerHTML = this.renderCard();
    }

    renderCard() {
        return `
		<div class="setup-card-line">
			<div class="setup-card-line-label">Sessions</div>
			<div class="setup-card-line-input">${this.sessions.render()}</div>				
			<div class="setup-card-line-label" style="color:#cccccc;margin-left:12px;">(Players<span id="sessions-players" style="margin-left:6px;">${this.sessions.value * this.data.players}</span>)</div>
		</div>
		<div class="setup-card-line">
			<div class="setup-card-line-label">Locales</div>
			<div class="setup-card-line-input">${this.locales.render()}</div>
		</div>
		<div class="setup-card-line">
			<div class="setup-card-line-label">Gender</div>
			<div class="setup-card-line-input">${this.genders.render()}</div>
		</div>`


    }

    render() {
        return `
		${this.header.render()}
		<div class="setup-card" id="${this.id}">
			${this.renderCard()}
		</div>`
    }
}


class SetupGameStep2 {
    constructor(o) {
        this.id = Utils.makeKey(5);
        this.game = o.game;
		this.data = o.data;
		this.filter = o.filter || {};
        this.header = new Header({
            badge: 2,
            label: 'Players'
        });
        this.players = null;
        this.sessions = 0;
        this.setup();
    }

	clear(){
		if(this.players){
			this.players.clear();
		}
	}

	

    setup() {
		this.clear();
        this.players = new SetupPlayers({
			parent: this,
			data: this.data,
			sessions: this.sessions,
			filter: this.filter || null
        });
    }

    update() {
        document.getElementById(this.id).innerHTML = this.renderCard();
    }

    renderCard() {
        return `
		<div class="setup-card-line">
			<div class="setup-card-line-input">${this.players.render()}</div>				
		</div>`
    }

    render() {
        return `
		${this.header.render()}
		<div class="setup-card" id="${this.id}">
			${this.renderCard()}
		</div>`
    }
}

class SetupPlayers {
    constructor(o) {
		this.data = o.data;
		this.parent = o.parent;
        this.players = o.data.players;
        this.sessions = o.sessions;
		this.filter = o.filter || {};
        this.total = this.players * this.sessions;
        this.users = [];
        this.groupLabels = ['A', 'B', 'C', 'D'];
        this.groups = [];
        this.setup();
	}
	
	clear(){
		for(let i = 0; i < this.groups.length; i++){
			this.groups[i].clear();
		}
	}

	getLsit(id){
		for(let i = 0; i < this.groups.length; i++){
			if(this.groups[i].id == id){
				return this.groups[i];
			}
		}
		return null;
	}

	checkListError(){
		return Utils.arrayUnique(this.groups.map(group=>{
			return group.list.length;
		})).length != 1;
	}

    setup() {
		this.users = Users.objListToArray(Users.data).filter((user, x) => {
			for(let k in this.filter){
				if(this.filter[k] != user[k]){
					return false;
				}
			}
			return true;
		});

        for (let i = 0; i < this.players; i++) {
            this.groups.push(new SetupPlayersGroup({
                parent: this,
                data: this.data,
                players: this.total / this.players,
                label: this.groupLabels[i],
                vs: i < this.players - 1,
                list: this.users.filter((user, x) => {
                    if (x >= this.total) {
                        return false
                    }
                    if ((x + i) % 2) {
                        return true
                    } else {
                        return false
                    }
                })
            }));
        }
    }

    renderGroups() {
        return this.groups.map((group) => {
            return group.render();
        }).join("");
    }

    render() {
        return `
		<div class="setup-player-groups p${this.data.players}">
			${this.renderGroups()}
		</div>`
    }
}

class SetupPlayersGroup {
    constructor(o) {
        this.id = Utils.makeKey(5);
        this.parent = o.parent;
        this.data = o.data;
        this.players = o.players;
        this.list = o.list;
        this.playerCards = [];
        this.label = o.label;
        this.vs = o.vs;
        this.sortable = null;
        this.setup();
    }
	
	clear(){
		if(this.sortable){
			this.sortable.destroy();
			this.sortable = null;
		}
	}

	getItemIndex(uid){
        for (let i = 0; i < this.list.length; i++) {
			if(this.list[i].uid == uid){
				return i;
			}
		}
		return null;
	}
	getItem(uid){
        for (let i = 0; i < this.list.length; i++) {
			if(this.list[i].uid == uid){
				return this.list[i];
			}
		}
		return null;
	}

    setup() {
        if (this.vs) {
            this.vs = [];
        }
        for (let i = 0; i < this.list.length; i++) {
            this.playerCards.push(new SetupPlayerCard({
                data: this.data,
                player: this.list[i]
            }));
            if (this.vs) {
                this.vs.push(new SetupVSCard());
            }
        }
    }

    sort() {
        if (!this.sortable) {
            setTimeout(() => {
				if(document.getElementById(`${this.id}_list`)){
					this.sortable = new Sortable.create(document.getElementById(`${this.id}_list`), {
						animation: 150,
						draggable: ".setup-player-card",
						group: "players",
						ghostClass: 'ghost',
						chosenClass: "chosen",
						onUpdate: (evt) => {
							this.updateList(evt);
						},
						onAdd: (evt) => {
							this.addList(evt);
						}
					});
				}
            }, 1000);
        }
    }

	updateList(evt){
		let from = evt.oldIndex;
		let to = evt.newIndex;
		this.list.splice(to, 0, this.list.splice(from, 1)[0])
		console.log(this.list);
	}

	addList(evt){
		let from = evt.from.dataset.list;
		let uid = evt.item.dataset.uid;
		let fromGroup = this.parent.getLsit(from);
		let itemIndex = fromGroup.getItemIndex(uid);
		let item = fromGroup.list.splice(itemIndex, 1)[0];

		let newIndex = Array.from(evt.item.parentElement.children).map(item=>{ 
			return item.dataset.uid
		}).map((iUid,x)=>{
			if(iUid == uid){ 
				return x 
			}
			return null;
		}).filter(x=>{ 
			if(x || x == 0){ 
				return true 
			}
		})[0];

		this.list.splice(newIndex, 0, item);
		this.parent.groups.map(group=>{
			group.updateHeader();
		});

	}

    updateHeader() {
        document.getElementById(`${this.id}_header`).innerHTML = `Player ${this.label} <div class="badge ${this.parent.checkListError() || this.list.length == 0 ? 'error' : ''}">${this.list.length}</div>`;
    }

    renderList() {
        return `
        <div id="${this.id}" class="setup-game-list-container player">
            <div id="${this.id}_header" class="setup-game-list-header player">Player ${this.label} <div class="badge ${this.parent.checkListError() || this.list.length == 0 ? 'error' : ''}">${this.list.length}</div></div>
            <div id="${this.id}_list" data-list="${this.id}" class="setup-game-list player">
                ${this.playerCards.map(card=>{
                    return card.render();
                }).join('')}
            </div>
        </div>`
    }

    renderVs() {
        if (this.vs) {
			return `
			<div id="${this.id}" class="setup-game-list-container vs">
				<div id="${this.id}_header" class="setup-game-list-header vs">VS</div>
				<div id="${this.id}_list" class="setup-game-list vs">
					${this.vs.map(card => {
						return card.render();
					}).join('')}
				</div>
			</div>`
        }
        return '';
    }

    render() {
        this.sort();
        return `
		${this.renderList()}
		${this.renderVs()}
		`
    }
}

class SetupPlayerCard {
    constructor(o) {
		this.id = Utils.makeKey(5);
        this.data = o.data;
        this.player = o.player;
    }

    render() {
        return `
		<div id="${this.id}" data-uid="${this.player.uid}" class="setup-player-card ${this.player.gender}">
			<div class="setup-player-card-avatar">
				<img src="${this.player.photoURL}" />
			</div>
			<div class="setup-player-card-info">
				<div class="setup-player-card-info name">${this.player.displayName}</div>
				<div class="setup-player-card-info locale"><img src="images/locale/${this.player.locale}.gif" /></div>
				<div class="setup-player-card-info age"></div>
			</div>
		</div>`
    }
}

class SetupVSCard {
    constructor() {}

    render() {
        return `
		<div class="setup-vs-card">
			<div class="setup-vs-card-icon">
				${Constants.SVG.VS}
			</div>
		</div>`
    }
}