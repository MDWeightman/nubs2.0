class NewGameCards {
    constructor() {
        this.cards = [];
        this.setUp();
    }

    setUp() {
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

    render() {
        return `
        <div class="new-game-card" title="Click to start new a game of ${this.name}">
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