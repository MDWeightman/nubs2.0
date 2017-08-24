class _Screen_Calendar {
    constructor() {
        this.name = "BandCalendar";
        this.table = new Table({});
        this.newEvent = null;
        this.types = {
            GIG: 'Gig',
            PRACTICE: 'Practice',
            HOL: 'Holiday'
        }
    }

    clear() {
        this.table = new Table({});
        this.newEvent = null;
    }

    addEvent() {
        this.newEvent = new EventCard();
        this.render();
    }
    saveEvent() {
        let event = {
            date: this.newEvent.date.getFullDate(),
            location: this.newEvent.location.value,
            name: this.newEvent.band.getLabel(),
            startTime: this.newEvent.time.value,
            type: this.newEvent.type.selected
        }
        if (event.type == "GIG") {
            Gigs.createGig(this.newEvent.band.selected, event);
        }
        if (event.type == "HOL") {
            delete event.startTime;
            event.name = User.data.displayName;
            event.end = this.newEvent.endDate.getFullDate();
            Holidays.createHoliday(User.data.uid, event);
        }
        if (event.type == "PRACTICE") {
            Practices.createPractice(this.newEvent.band.selected, event);
        }
        this.clear();
    }

    renderNewEvent() {
        Application.workspace.innerHTML = `
		<div class="calendar-event-card">
			${this.newEvent.render()}
		</div>`
    }

    getDates() {
        let dates = {}
        let now = new Date();
        now.setHours(0, 0, 0, 0);

        for (let k in Gigs.data) {
            for (let i in Gigs.data[k]) {
                dates[i] = Gigs.data[k][i];
                dates[i].band = Bands.data[k];
                dates[i].type = 'GIG';
                if (dates[i].date < now.getTime()) {
                    delete dates[i];
                }
            }
        }
        for (let k in Practices.data) {
            for (let i in Practices.data[k]) {
                dates[i] = Practices.data[k][i];
                dates[i].band = Bands.data[k];
                dates[i].type = 'PRACTICE';
                if (dates[i].date < now.getTime()) {
                    delete dates[i];
                }
            }
        }
        for (let k in Holidays.data) {
            for (let i in Holidays.data[k]) {
                dates[i] = Holidays.data[k][i];
                dates[i].type = 'HOL';
                let days = this.getDays(dates[i]);
                let date = new Date(dates[i].date);
                if (date.getTime() < now.getTime()) {
                    delete dates[i];
                    continue;
                }
                for (let d = 0; d < days; d++) {
                    date.setDate(date.getDate() + 1);
                    dates[i + d] = JSON.parse(JSON.stringify(Holidays.data[k][i]));
                    dates[i + d].date = date.getTime();
                    dates[i + d].type = 'HOL';
                }
            }
        }

        dates = Utils.sortObjectOn(dates, "date");
        return dates;
    }

    getDays(event) {
        return (((((event.end - event.date) / 1000) / 60) / 60) / 24)
    }

    renderTable() {
        let calendar = new DatePickerCalendar();
        let dates = this.getDates();
        console.log(dates);
        for (let d in dates) {
            let event = dates[d];
            let type = event.type;
            let row = new TableRow();
            let date = new Date(event.date);
            row.addColumn({
                style: 'width:100px;max-width:100px;vertical-align: top;',
                wrapperStyle: 'padding: 6px 6px;',
                padding: false,
                input: new GigDate({
                    date: date.getDate(),
                    month: calendar.monthsL[date.getMonth()],
                    day: calendar.days[date.getDay()]
                })
            });
            row.addColumn({
                wrapperStyle: 'vertical-align: top;padding: 0px 12px;',
                input: this.getInputType(event)
            })

            this.table.addRow(row);
        }

        Application.workspace.innerHTML = this.table.render();
    }

    getInputType(event) {
        switch (event.type) {
            case 'GIG':
                return new GigCard({
                    band: event.band,
                    data: event
                });
            case 'HOL':
                return new HolCard({
                    colour: '#F44336',
                    data: event
                });
            case 'PRACTICE':
                return new PracticeCard({
                    band: event.band,
                    data: event
                });
        }
    }

    render() {
        let HTML = '';

        if (this.newEvent) {
            UI.Toolbar.setTitle("Add Event");
            UI.Toolbar.tabs.clear();
            UI.Toolbar.setActions([
                new ToolbarAction({
                    icon: Constants.SVG.SAVE,
                    label: 'Save Event',
                    event: () => {
                        this.saveEvent();
                    }
                })
            ]);
            this.renderNewEvent();
        } else {
            UI.Toolbar.setTitle("Calendar");
            UI.Toolbar.tabs.clear();
            UI.Toolbar.setActions([
                new ToolbarAction({
                    icon: Constants.SVG.PLUS,
                    label: 'Add Event',
                    event: () => {
                        this.addEvent();
                    }
                })
            ]);
            this.renderTable();
        }

        UI.render();
        UI.Dialog.clear();
    }
}

let Screen_Calendar = new _Screen_Calendar();