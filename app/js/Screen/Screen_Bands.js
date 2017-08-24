class _Screen_Bands {
    constructor() {
        this.name = "Bands";
        this.table = new Table({});
    }

    addBandDialog() {
        UI.Dialog.show(new DialogAddBand({
            title: 'Add Band',
            full: true,
            actions: new DialogActions([
                new DialogAction({
                    //icon: Constants.SVG.DELETE,
                    label: "CANCEL",
                    event: function() {
                        UI.Dialog.clear();
                    }
                }),
                new DialogAction({
                    // icon: Constants.SVG.SAVE,
                    label: "SAVE",
                    event: () => {
                        User.addBand(UI.Dialog.current.bands.selected).then(() => {
                            this.render();
                        });
                    }
                })
            ])
        }))
    }

    newBandDialog() {
        UI.Dialog.show(new DialogNewBand({
            title: 'New Band',
            actions: new DialogActions([
                new DialogAction({
                    label: "CANCEL",
                    event: function() {
                        UI.Dialog.clear();
                    }
                }),
                new DialogAction({
                    label: "OK",
                    event: () => {
                        Bands.createBand({ name: UI.Dialog.current.name.value, colour: Utils.makeColor() }).then(() => {
                            Screen_Bands.addBandDialog();
                        });
                        UI.Dialog.clear();
                    }
                })
            ])
        }))
    }

    renderTable() {
        this.table.clear();
        if (User.data.bands) {
            for (let k in User.data.bands) {
                let band = Bands.data[k];
                let row = new TableRow({
                    action: new TableRowAction({
                        icon: Constants.SVG.DELETE,
                        event: () => {
                            User.removeBand(k).then(() => {
                                UI.Dialog.toast(`${Bands.data[k].name} removed`);
                                this.render();
                            })
                        }
                    })
                });
                row.addColumn({
                    value: band.name
                });

                this.table.addRow(row);
            }
        }

        Application.workspace.innerHTML = this.table.render();
    }

    render() {
        let HTML = '';
        UI.Toolbar.setTitle("Bands");
        UI.Toolbar.tabs.clear();
        UI.Toolbar.setActions([
            new ToolbarAction({
                icon: Constants.SVG.PLUS,
                label: 'Add Band',
                event: () => {
                    this.addBandDialog();
                }
            })
        ]);

        this.renderTable();

        UI.render();
        UI.Dialog.clear();
    }
}

let Screen_Bands = new _Screen_Bands();

class DialogAddBand extends DialogItem {
    constructor(o) {
        super(o);
        this.title = 'Add Band';
        this.bands = new Menu({
            label: 'Bands',
            style: 'padding: 0px 0px 0px 10px;height: 30px;',
            options: new MenuOptions()
        });
        this.setUp();
    }

    setUp() {
        let group = this.bands.options.addGroup({});
        for (let k in Bands.data) {
            let band = Bands.data[k];
            group.addItem({
                value: k,
                label: band.name,
                event: () => {
                    this.bands.setSelected(k);
                }
            });
        }
        let group2 = this.bands.options.addGroup({});
        group2.addItem({
            value: 'NEW',
            label: 'Add New Band',
            style: "color:#4CAF50;",
            event: () => {
                UI.Dialog.clear();
                setTimeout(() => {
                    Screen_Bands.newBandDialog();
                }, 400);
            }
        });
    }

    render() {
        let HTML = `
		<div class="dialog-form-item">
			<div class="dialog-form-item-label">Band</div>
			<div class="dialog-form-item-input">${this.bands.render()}</div>
		</div>`
        super.render(HTML);
    }
}

class DialogNewBand extends DialogItem {
    constructor(o) {
        super(o);
        this.title = 'New Band';
        this.name = new TextInput({
            focus: true,
            style: 'width:100%',
            placeholder: 'Band Name'
        })
    }

    render() {
        let HTML = `
		<div class="dialog-form-item">
			<div class="dialog-form-item-label">Band Name</div>
			<div class="dialog-form-item-input">${this.name.render()}</div>
		</div>`
        super.render(HTML);
    }
}