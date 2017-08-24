class TextInput {
    constructor(o) {
        this.id = Utils.makeKey(5);
        this.value = o ? o.value || "" : "";
        this.data = o ? o.data || null : null;
        this.spellcheck = o ? o.spellcheck == false ? false : true : true;
        this.mandatory = o ? o.mandatory || false : false;
        this.error = false;
        this.style = o ? o.style || null : null;
        this.placeholder = o ? o.placeholder || null : null;
        this.event = o ? o.event || null : null;
    }

    addEventListener() {
        setTimeout(() => {
            if (document.getElementById(this.id)) {
                document.getElementById(this.id).addEventListener("change", () => {
                    let value = document.getElementById(this.id).value;
                    this.value = value;
                    if (this.data) {
                        this.data = this.value;
                    }
                    this.error = false;
                    if (this.mandatory && this.value == "") {
                        this.error = true;
                    }
                    if (this.error) {
                        document.getElementById(this.id).classList.add("error");
                    } else {
                        document.getElementById(this.id).classList.remove("error");
                    }
                    if (this.event) {
                        this.event();
                    }
                });
            }
        }, 500);
        return this;
    }

    clear() {
        this.value = "";
    }

    focus() {
        if (document.getElementById(this.id)) {
            document.getElementById(this.id).focus();
        }
    }

    sertError() {
        this.error = true;
        document.getElementById(this.id).classList.add("error");
    }

    render() {
        this.addEventListener();
        this.error = false;
        if (this.mandatory && this.value == "") {
            this.error = true;
        }
        return `
		<div class="data-input-container">
			<input type="text" style="${this.style}" class="data-input ${this.error ? "error" : ""}" id="${this.id}" spellcheck="${this.spellcheck}" placeholder="${this.placeholder ? this.placeholder : ""}" value="${this.value}" />
		</div>`
    }

}