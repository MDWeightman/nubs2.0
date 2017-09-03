class NewGameCards {
    constructor() {
        this.cards = [];
        this.setup();
    }

    setup() {
        for (let k in Games.data) {
            let game = Games.data[k];
            this.cards.push(new NewGameCard({
                key: k,
                data: game
            }));
        }
    }

    render() {
        return `
		<div class="new-game-cards">
			${this.cards.map(card=>{
				return card.render();
			}).join("")}
		</div>`;
    }

}


class NewGameCard {
    constructor(o) {
        this.key = o.key;
        this.data = o.data;
    }

    event() {
        Screen_NewGame.setSetupGame(new SetupGame({
            data: Games.getGame(this.key),
            title: `New ${this.data.name}`
        }));
    }

    addEventListener() {
        setTimeout(() => {
            if (document.getElementById(this.key)) {
                document.getElementById(this.key).addEventListener('click', () => {
                    this.event();
                });
            }
        }, 1000);
    }

    render() {
        this.addEventListener();
        return `
        <div id="${this.key}" class="new-game-card" title="Click to start new a game of ${this.data.name}">
            <div class="new-game-card-header">
				<div class="new-game-card-header-title">${this.data.name}</div>
				<div class="new-game-card-header-played">
					<div class="new-game-card-header-played-icon">${Constants.SVG.PLAY}</div>
					<div class="new-game-card-header-played-counter">${this.data.played}</div>
				</div>
            </div>
			<div class="new-game-card-content">				
            	<div class="new-game-card-description">${this.data.description}</div>
			</div>
        </div>`
    }
}