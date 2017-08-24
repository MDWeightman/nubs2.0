class Sidebar {
    constructor() {
        this.container = document.getElementById("sidebar");
        this.content = document.getElementById("sidebar-content");
        this.groups = [];
    }

    addGroup(group) {
        if (group.constructor.name != "SidebarItem") {
            group = new SidebarGroup(group);
        }
        this.groups.push(group);
        return group;
    }

    getItem(id) {
        for (var g = 0; g < this.groups.length; g++) {
            for (var i = 0; i < this.groups[g].items.length; i++) {
                if (this.groups[g].items[i].id == id) {
                    return this.groups[g].items[i];
                }
            }
        }
        return null;
    }

    open(event) {
        event.stopImmediatePropagation();
        this.container.classList.remove("collapsed");
        this.container.classList.add("active");
    }

    close(event) {
        event.stopImmediatePropagation();
        this.container.classList.remove("active");
    }

    setUp() {
        if (this.groups.length == 0) {
            if (User.data) {
                this.addGroup(new SidebarGroup({
                    label: "Games",
                    items: [
                        new SidebarItem({
                            icon: Constants.SVG.NEW_GAME,
                            label: 'New Game',
                            screen: 'NewGame',
                            event: () => {
                                Screen_NewGame.clear();
                                Application.Screen.set(Screen_NewGame);
                            }
                        }),
                        new SidebarItem({
                            icon: Constants.SVG.CALENDAR,
                            label: 'Played Games',
                            screen: 'PlayedGames',
                            event: () => {
                                Screen_PlayedGames.clear();
                                Application.Screen.set(Screen_PlayedGames);
                            }
                        })
                    ]
                }));
            }
        }
    }

    render() {
        this.setUp();
        let HTML = '';

        for (let i = 0; i < this.groups.length; i++) {
            let group = this.groups[i];
            HTML += group.render();
        }

        this.content.innerHTML = HTML;
    }
}


class SidebarGroup {
    constructor(o) {
        this.label = o.label;
        this.items = o.items || [];
    }

    addItem(item) {
        if (item.constructor.name != "SidebarItem") {
            item = new SidebarItem(item);
        }
        this.items.push(item);
        return this;
    }

    render() {
        let HTML = '';
        HTML += `
		<div class="sidebar-content-group">
			<div class="sidebar-group-heading">${this.label}</div>`;
        for (let i = 0; i < this.items.length; i++) {
            HTML += this.items[i].render();
        }
        HTML += `</div>`

        return HTML;
    }

}
class SidebarItem {
    constructor(o) {
        this.id = Utils.makeKey(5);
        this.icon = o.icon || null;
        this.value = o.value || null;
        this.screen = o.screen;
        this.label = o.label;
        this.event = o.event;
    }

    render() {
        return `
		<div class="sidebar-content-item ${this.screen == Application.getScreenName() ? "active" : ""}" onclick="UI.Sidebar.getItem('${this.id}').event();">
			<div class="item">
				<div class="icon ${this.value ? "badge" : ""}">${this.icon ? this.icon : this.value}</div>
				<div class="text">${this.label}</div>
			</div>
		</div>
		`;
    }
}