class _Screen_NewGame {
    constructor() {
        this.title = 'New Game';
        this.name = 'NewGame';
        this.newCameCards = null;
    }

    clear() {

    }

    renderGameCards() {
        this.newCameCards = new NewGameCards();
        Application.render(this.newCameCards.render());
    }

    render() {
        UI.Toolbar.setTitle(this.title);
        UI.Toolbar.tabs.clear();
        this.renderGameCards();
    }
}

let Screen_NewGame = new _Screen_NewGame();