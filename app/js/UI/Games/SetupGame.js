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
        this.setup();
    }

    setup() {
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
			<div class="setup-card-line-label" style="color:#cccccc;margin-left:12px;">(Players<span id="sessions-players" style="margin-left:6px;">${this.sessions.value * this.data.players}</span>)</div></div>
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
        this.header = new Header({
            badge: 2,
            label: 'Players'
        })
        this.players = null;
        this.sessions = 0;
        this.setup();
    }

    setup() {
        this.players = new SetupPlayers({
            data: this.data,
            sessions: this.sessions
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
        this.players = o.data.players;
        this.sessions = o.sessions;
        this.total = this.players * this.sessions;
        this.users = Users.objListToArray(Users.data);
        this.groupLabels = ['A', 'B', 'C', 'D'];
        this.groups = [];
        this.setup();
    }

    setup() {
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
                this.sortable = new Sortable.create(document.getElementById(`${this.id}_list`), {
                    animation: 150,
                    draggable: ".setup-player-card",
                    group: "players",
                    ghostClass: 'ghost',
                    chosenClass: "chosen",
                    onUpdate: (evt) => {
                        console.log(self.id, evt);
                    },
                    onAdd: (evt) => {
                        //self._moveUser(evt, "A");
                    }
                });
                console.log(this.id, this.sortable);
            }, 1000);
        }
    }

    updateHeader() {
        document.getElementById(`${this.id}_header`).innerHTML = `Player ${this.label} [${this.list.length}]`;
    }

    renderList() {
        return `
        <div id="${this.id}" class="setup-game-player-list-container">
            <div id="${this.id}_header" class="setup-game-player-list-header">Player ${this.label} [${this.list.length}]</div>
            <div id="${this.id}_list" class="setup-game-player-list">
                ${this.playerCards.map(card=>{
                    return card.render();
                }).join('')}
            </div>
        </div>`
    }

    renderVs() {
        if (this.vs) {
            return this.vs.map(card => {
                return card.render();
            }).join('');
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
        this.data = o.data;
        this.player = o.player;
    }

    render() {
        return `
		<div class="setup-player-card ${this.player.gender}">
			<div class="setup-player-card-avatar">
				<img src="${this.player.photoURL}" />
			</div>
			<div class="setup-player-card-info">
				<div class="setup-player-card-info-name">${this.player.displayName}</div>
				<div class="setup-player-card-info-age"></div>
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