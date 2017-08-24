class Dialog {
    constructor() {
        this.current = null;
    }

    show(dialog) {
        this.current = dialog;
        this.current.render();
        if (this.current.focus) {
            setTimeout(() => {
                document.getElementById(this.current.focus).focus();
            }, 200);
        }
        setTimeout(() => {
            document.getElementById('dialog-container').classList.add('in');
        }, 200);
    }

    toast(message, colour) {
        let HTML = `<div class="dialog-toast-text">${message}</div>`
        let d = document.createElement("div");
        d.className = "dialog-toast";
        d.innerHTML = HTML;

        document.body.appendChild(d);

        if (colour) {
            document.querySelector(".dialog-toast").style.cssText = `background-color:${colour};`;
        }

        setTimeout(() => {
            d.classList.add("active");
        }, 150);

        setTimeout(() => {
            d.classList.remove("active");
            setTimeout(() => {
                document.body.removeChild(d);
            }, 300);
        }, 4000);
    }

    clear() {
        if (this.current) {
            document.getElementById('dialog-container').classList.remove('in');
            document.getElementById('dialog-container').classList.add('out');
            setTimeout(() => {
                let d = document.getElementById("dialog");
                if (d) {
                    document.body.removeChild(d);
                }
                this.current = null;
            }, 200);
        }
    }

    runAction(label) {
        let a = this.current.getAction(label);
        if (a) {
            a.run();
        }
    }

}

class DialogItem {
    constructor(o) {
        this.title = o.title || "";
        this.focus = o.focus || null;
        this.error = o.error || null;
        this.padding = true;
        this.full = o.full || false;
        this.actions = o.actions || new DialogActions();
    }

    addAction(action) {
        if (action.constructor.name != "DialogAction") {
            action = new DialogAction(action);
        }
        this.actions.push(action);
    }

    getAction(label) {
        return this.actions.getAction(label);
    }

    render(content) {
        let HTML = `
		<div id="dialog" class="${this.full ? 'full' : ''}">
			<div id="dialog-overlay"></div>
			<div id="dialog-container">
                <div id="dialog-header" class="${this.error ? "error" : ""}" style="${this.title ? '' : 'display:none;'}">
                    <div id="dialog-header-back" onclick="UI.Dialog.clear();">${Constants.SVG.BACK}</div>
					<div id="dialog-header-text">${this.title}</div>
				</div>
				<div id="dialog-content" class="${!this.padding ? 'noPadding' : ''}">${content}</div>
				<div id="dialog-actions">${this.actions.render()}</div>
			</div>
		</div>`;

        let d = document.createElement("div");
        d.innerHTML = HTML;

        document.body.appendChild(d.childNodes[1]);
    }
}



class DialogText extends DialogItem {
    constructor(o) {
        super(o);
        this.text = o.text;
    }

    render() {
        let HTML = `<div class="dialog-text">${this.text}</div>`;
        super.render(HTML);
    }
}

class DialogLogin extends DialogItem {
    constructor(o) {
        super(o);
        this.title = "Login";
        this.username = "";
        this.password = "";
        this.remember = new BoolInput({
            label: "Remember Me"
        });
    }

    setUsername(event, value) {
        this.username = value;
        let keyCode = event.keyCode;
        if (keyCode == 13) {
            this.actions.getAction("LOGIN").event(this.remember.value);
        }
    }

    setPassword(event, value) {
        this.password = value;
        let keyCode = event.keyCode;
        if (keyCode == 13) {
            this.actions.getAction("LOGIN").event(this.remember.value);
        }
    }

    setRememberMe(value) {
        this.remember = value;
    }

    errorM(message) {
        document.getElementById("dialog-username").classList.add("error");
        document.getElementById("dialog-password").classList.add("error");
        document.getElementById("dialog-error").innerHTML = message;
    }

    render() {
        let HTML = `
		<div class="dialog-form-item">
			<div class="dialog-form-item-label">Username</div>
			<div class="dialog-form-item-input"><input id="dialog-username" value="" onchange="UI.Dialog.current.setUsername(event, this.value);" autocomplete="off"/></div>
		</div>
		<div class="dialog-form-item">
			<div class="dialog-form-item-label">Password</div>
			<div class="dialog-form-item-input"><input id="dialog-password" value="" type="password" onchange="UI.Dialog.current.setPassword(event, this.value);" autocomplete="off"/></div>
		</div>
		<div class="dialog-form-item">
			${this.remember.render()}
		</div>
		<div class="dialog-form-item">
			<div id="dialog-error" class="dialog-form-item-error"></div>
		</div>`
        super.render(HTML);
    }
}

class DialogActions {
    constructor(o) {
        this.items = o ? o : [];
    }

    render() {
        let HTML = '';
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
            HTML += item.render();
        }
        return HTML;
    }

    getAction(label) {
        for (let i in this.items) {
            if (this.items[i].label == label) {
                return this.items[i];
            }
        }
        return null;
    }
}

class DialogAction {
    constructor(o) {
        this.label = o.label || "";
        this.icon = o.icon || null
        this.event = o.event || null
    }

    run() {
        if (this.event) {
            this.event();
        }
    }

    render() {
            return `
		<div class="dialog-action-${this.icon ? 'icon' : 'item'}" onclick="UI.Dialog.runAction('${this.label}');">
			${this.icon ? 
				`<div class="dialog-action-item-icon" title="${this.label}">${this.icon}</div>` :
				`<div class="dialog-action-item-text">${this.label}</div>`
			}
		</div>`
    }
}