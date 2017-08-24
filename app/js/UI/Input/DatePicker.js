class DatePicker extends TextInput {
    constructor(o) {
        super(o);
        this.full = o ? o.full : false;
        this.value = o ? this.fixValue(o.value) || null : null;
        this.calendar = new DatePickerCalendar({
            picker: this,
            value: this.fixValue(this.value)
        })
    }

    getFullDate() {
        return new Date(this.value).getTime();
    }

    fixValue(value) {
        let date = new Date(value);
        if (date) {
            value = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
        }

        let d = value.split('-');
        if (d[0].length < 4) {
            return `${d[1]}/${('00'+(d[2])).slice(-2)}/${d[0]}`;
        }
        return this.value;
    }

    // addEventListener() {
    //     setTimeout(() => {
    //         if (document.getElementById(this.id)) {
    //             document.getElementById(this.id).addEventListener("click", (event) => {
    //                 event.stopImmediatePropagation();
    //                 this.dialog();
    //             });
    //         }
    //     }, 500);
    //     return this;
    // }

    dialog() {
        UI.Dialog.show(new DialogDatePicker({
            calendar: this.calendar
        }));
    }

    render() {
        super.render();
        return `
		<div class="data-input-container">
			<input type="date" style="${this.style}" class="data-input ${this.error ? "error" : ""}" id="${this.id}" value="${this.value}" />
		</div>`
    }

}

class DatePickerCalendar {
    constructor(o) {
        this.picker = o ? o.picker || null : null;
        this.value = o ? o.value || null : null;
        this.monthsL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.monthsS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.weeks = [];
        this.selectedDate = this.value ? new Date(this.value) : new Date();
        this.currentDate = this.value ? new Date(this.value) : new Date();
        this.now = new Date();
        this.now.setHours(0, 0, 0, 0);

        this.monthMenu = new Menu({
            dark: true,
            selected: this.selectedDate.getMonth(),
            options: new MenuOptions()
        })
        this.yearMenu = new Menu({
            dark: true,
            selected: this.selectedDate.getFullYear(),
            options: new MenuOptions(Constants.years.map((year) => {
                return new MenuOption({
                    label: year,
                    value: year,
                    event: () => {
                        this.yearMenu.setSelected(year);
                        this.update();
                    }
                })
            }))
        })
    }

    addWeek() {
        this.weeks.push(new DatePickerWeek());
    }

    getWeek(week) {
        if (!this.weeks[week]) { this.addWeek() }
        return this.weeks[week];
    }

    setMenu() {
        this.monthMenu.options = new MenuOptions();
        for (let i = 0; i < this.monthsL.length; i++) {
            let file = this.monthsL[i];
            this.monthMenu.options.addItem({
                label: file,
                value: i,
                event: () => {
                    this.monthMenu.setSelected(i);
                    this.update();
                }
            });
        }
    }

    setUp() {
        if (this.monthMenu.options.items.length == 0) {
            this.setMenu();
        }
        let month = this.currentDate.getMonth();
        let year = this.currentDate.getFullYear();
        let startOfMonth = new Date();
        startOfMonth.setYear(year);
        startOfMonth.setMonth(month);
        startOfMonth.setDate(1);
        let date = new Date();
        date.setYear(year);
        date.setMonth(month);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);

        this.weeks = [];
        let week = 0;

        date.setDate(date.getDate() - (startOfMonth.getDay() + 1));

        //Last Month
        for (let i = 0; i < startOfMonth.getDay(); i++) {
            date.setDate(date.getDate() + 1);
            this.getWeek(week).addDay({
                value: date.getDate(),
                past: true,
                today: this.now.getTime() == date.getTime(),
                selected: this.selectedDate.getTime() == date.getTime()
            });
        }

        //This Month
        date.setYear(year);
        date.setDate(1);
        date.setMonth(month);
        for (let i = startOfMonth.getDay(); i < this.days.length; i++) {
            this.getWeek(week).addDay({
                value: date.getDate(),
                today: this.now.getTime() == date.getTime(),
                selected: this.selectedDate.getTime() == date.getTime()
            });
            date.setDate(date.getDate() + 1);
            if (date.getMonth() > startOfMonth.getMonth() || date.getFullYear() > startOfMonth.getFullYear()) {
                break;
            }
            if (i + 1 == 7) {
                i = -1;
                week++;
            }
        }

        //Next Month
        for (let i = this.getWeek(week).days.length; i < this.days.length; i++) {
            this.getWeek(week).addDay({
                value: date.getDate(),
                future: true,
                today: this.now.getTime() == date.getTime(),
                selected: this.selectedDate.getTime() == date.getTime()
            });
            date.setDate(date.getDate() + 1);
        }

        return this;
    }

    confirm() {
        this.picker.value = this.value;
    }

    setSelectedDate(date) {
        this.selectedDate.setDate(date);
        this.selectedDate.setMonth(this.monthMenu.selected);
        this.selectedDate.setYear(this.yearMenu.selected);
        this.value = `${this.selectedDate.getFullYear()}-${('00'+(this.selectedDate.getMonth()+1)).slice(-2)}-${('00'+(this.selectedDate.getDate())).slice(-2)}`;
        this.update();
    }

    renderDays() {
        let HTML = '';
        for (let i = 0; i < this.days.length; i++) {
            HTML += `<div class="date-picker-calenday-day">${this.days[i][0]}</div>`;
        }
        return HTML;
    }

    renderWeeks() {
        let HTML = '';
        for (let i = 0; i < this.weeks.length; i++) {
            HTML += this.weeks[i].render();
        }
        return HTML;
    }

    update() {
        this.currentDate.setMonth(Number(this.monthMenu.selected));
        this.currentDate.setYear(Number(this.yearMenu.selected));
        this.setUp();
        document.getElementById("dialog-content").innerHTML = this.render();
    }

    render() {
        return `
		<div class="date-picker-calendar-container">
			<div class="date-picker-header">
				<div class="date-picker-header-year">${this.selectedDate.getFullYear()}</div>
				<div class="date-picker-header-day">${this.days[this.selectedDate.getDay()]}</div>
				<div class="date-picker-header-date">${this.monthsL[this.selectedDate.getMonth()]} ${this.selectedDate.getDate()}</div>
			</div>
			<div class="date-picker-calendar">
				<div class="date-picker-calendar-menus">
					<div class="date-picker-calendar-menu">${this.monthMenu.render()}</div>
					<div class="date-picker-calendar-menu">${this.yearMenu.render()}</div>
				</div>
				<div class="date-picker-calendar-days">${this.renderDays()}</div>
				<div class="date-picker-calendar-weeks">${this.renderWeeks()}</div>
			</div>
		</div>`;
    }

}

class DatePickerWeek {
    constructor(o) {
        this.days = [];
    }

    addDay(day) {
        if (day.constructor.name != "DatePickerDay") {
            day = new DatePickerDay(day);
        }
        this.days.push(day);
    }

    render() {
        let HTML = '<div class="date-picker-week">';

        for (let i = 0; i < this.days.length; i++) {
            HTML += this.days[i].render();
        }

        HTML += '</div>';
        return HTML;
    }

}

class DatePickerDay {
    constructor(o) {
        this.value = o ? o.value || null : null;
        this.today = o ? o.today || false : false;
        this.past = o ? o.past || false : false;
        this.future = o ? o.future || false : false;
        this.selected = o ? o.selected || false : false;
    }

    render() {
        return `
		<div class="date-picker-day-container">
			<div class="date-picker-day ${this.today ? 'today' : ''} ${this.selected ? 'selected' : ''} ${this.past || this.future ? 'outside' : ''}" onclick="UI.Dialog.current.calendar.setSelectedDate(${this.value})">${this.value}</div>
		</div>`
    }
}

class DialogDatePicker extends DialogItem {
    constructor(o) {
        super(o);
        this.calendar = o.calendar;
        this.full = o.calendar.picker.full;
        this.padding = false,
            this.actions = new DialogActions([
                new DialogAction({
                    label: 'CANCEL',
                    event: () => {
                        UI.Dialog.clear();
                    }
                }),
                new DialogAction({
                    label: 'OK',
                    event: () => {
                        this.calendar.confirm();
                        Application.Screen.current.render();
                        UI.Dialog.clear();
                    }
                })
            ])
    }

    render() {
        super.render(this.calendar.render());
    }
}