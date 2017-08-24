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

    getData(screen) {
        Bands.getBands();
        Gigs.getGigs();
        Practices.getPractices();
        Holidays.getHolidays();
        if (screen) {
            setTimeout(() => {
                this.Screen.set(screen);
            }, 1000);
        }
    }

    readonly() {
        this.workspace.classList.add("readonly");
    }

    clearReadonly() {
        this.workspace.classList.remove("readonly");
    }

    render() {
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
Application.render();
Application.getData();