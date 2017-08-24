class _Application {
    constructor() {
        this.workspace = document.getElementById("workspace");
        this.Screen = new Screen();
    }

    getScreenName() {
        if (this.Screen.current) {
            return this.Screen.current.name;
        }
        return null;
    }

    getData() {
        Games.getData();
    }

    readonly() {
        this.workspace.classList.add("readonly");
    }

    clearReadonly() {
        this.workspace.classList.remove("readonly");
    }

    render(HTML) {
        if (HTML) {
            this.workspace.innerHTML = HTML;
            UI.render();
            return;
        }
        this.clearReadonly();
        if (!User.isAuthenticated()) {
            User.loginDialog();
        } else {
            this.Screen.render();
        }
        UI.render();
    }

}

let Application = new _Application();
Application.getData();
Application.render();