class GigCard {
    constructor(o) {
        this.band = o.band;
        this.data = o.data;
    }

    render() {
        return `
        <div class="gig-card" style="background-color:${this.band.colour}">
            <div class="gig-card-type">Gig</div>
            <div class="gig-card-band">${this.data.band.name}</div>
            <div class="gig-card-location">${this.data.location}</div>
            <div class="gig-card-start">${this.data.startTime}</div>
        </div>`
    }
}

class PracticeCard {
    constructor(o) {
        this.band = o.band;
        this.data = o.data;
    }

    render() {
        return `
        <div class="gig-card" style="background-color:${this.band.colour};opacity:0.8;">
            <div class="gig-card-type">Practice</div>
            <div class="gig-card-band">${this.data.band.name}</div>
            <div class="gig-card-location">${this.data.location}</div>
            <div class="gig-card-start">${this.data.startTime}</div>
        </div>`
    }
}

class HolCard {
    constructor(o) {
        this.colour = o.colour;
        this.data = o.data;
    }

    render() {
        return `
        <div class="gig-card" style="background-color:${this.colour}">
            <div class="gig-card-type">Holiday</div>
            <div class="gig-card-band">${this.data.name}</div>
            <div class="gig-card-location">${this.data.location}</div>
        </div>`
    }
}

class GigDate {
    constructor(o) {
        this.date = o.date;
        this.month = o.month;
        this.day = o.day;
    }

    render() {
        return `
        <div class="gig-date">
            <div class="gig-date-date">${this.date}</div>
            <div class="gig-date-month">${this.month}</div>
            <div class="gig-date-day">${this.day}</div>
        </div>`
    }
}

class EventCard {
    constructor(o) {
        this.type = new Menu({
            label: 'Event Type',
            dark: true,
            optionsStyle: 'right:10px;width:200px;',
            options: new MenuOptions()
        });
        this.band = new Menu({
            label: 'Band',
            dark: true,
            optionsStyle: 'right:10px;width:200px;',
            options: new MenuOptions()
        });
        this.location = new TextInput({
            value: '',
            placeholder: 'Location',
            style: 'box-shadow:none;'
        });
        this.date = new DatePicker({
            value: new Date().getTime(),
            style: 'box-shadow:none;'
        });
        this.endDate = new DatePicker({
            value: new Date().getTime(),
            style: 'box-shadow:none;'
        });
        this.time = new TimePicker({
            value: new Date().getTime(),
            style: 'box-shadow:none;'
        });
        this.setUp();
    }

    setUp() {
        for (let k in Screen_Calendar.types) {
            let type = Screen_Calendar.types[k];
            this.type.options.addItem({
                value: k,
                label: type,
                event: () => {
                    this.type.setSelected(k);
                    Screen_Calendar.renderNewEvent();
                }
            });
        }
        for (let k in Bands.data) {
            let band = Bands.data[k];
            this.band.options.addItem({
                value: k,
                label: band.name,
                event: () => {
                    this.band.setSelected(k);
                }
            });
        }
    }

    render() {
        return `
		<div class="calendar-event-form">
			<div class="calendar-event-form-item">
				<div class="calendar-event-form-item-label">Event Type</div>
				<div class="calendar-event-form-item-input">${this.type.render()}</div>
			</div>
			<div class="calendar-event-form-item" style="${this.type.selected == "HOL" || !this.type.selected ? "display:none;" : ""}">
				<div class="calendar-event-form-item-label">Band</div>
				<div class="calendar-event-form-item-input">${this.band.render()}</div>
			</div>
			<div class="calendar-event-form-item" style="${!this.type.selected ? "display:none;" : ""}">
				<div class="calendar-event-form-item-label">Location</div>
				<div class="calendar-event-form-item-input">${this.location.render()}</div>
			</div>
			<div class="calendar-event-form-item" style="${!this.type.selected ? "display:none;" : ""}">
				<div class="calendar-event-form-item-label">Date</div>
				<div class="calendar-event-form-item-input">${this.date.render()}</div>
			</div>
			<div class="calendar-event-form-item" style="${!this.type.selected || this.type.selected != 'HOL' ? "display:none;" : ""}">
				<div class="calendar-event-form-item-label">End Date</div>
				<div class="calendar-event-form-item-input">${this.endDate.render()}</div>
			</div>
			<div class="calendar-event-form-item" style="${!this.type.selected || this.type.selected == 'HOL'  ? "display:none;" : ""}">
				<div class="calendar-event-form-item-label">Time</div>
				<div class="calendar-event-form-item-input">${this.time.render()}</div>
			</div>
		</div>`
    }
}