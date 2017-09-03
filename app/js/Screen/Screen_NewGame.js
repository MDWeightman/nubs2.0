class _Screen_NewGame {
    constructor() {
        this.title = 'New Game';
        this.name = 'NewGame';
        this.newCameCards = null;
        this.setupGame = null;
    }

    clear() {

    }

    setSetupGame(setup) {
        this.setupGame = setup;
        this.title = this.setupGame.title;
        this.render();
    }

    renderSetupGame() {
        Application.render(this.setupGame.render());
    }

    renderGameCards() {
        this.newCameCards = new NewGameCards();
        Application.render(this.newCameCards.render());
    }

    render() {
        UI.Toolbar.setTitle(this.title);
        UI.Toolbar.tabs.clear();
        if (!this.setupGame) {
            this.renderGameCards();
        } else {
            this.renderSetupGame();
        }
    }
}

let Screen_NewGame = new _Screen_NewGame();