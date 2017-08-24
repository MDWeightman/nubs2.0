class _Holidays extends Firebase {
    constructor() {
        super();
        this.data = null;
        this.node = 'holidays';
    }

    setData(data) {
        this.data = data;
        console.log(this.node, this.data);
    }

    getHolidays() {
        return firebase.database().ref(`/${this.node}`).on('value', snapshot => {
            this.setData(snapshot.val());
        });
    }

    createHoliday(userKey, data) {
        var newKey = firebase.database().ref().child(`${this.node}/${userKey}`).push().key;
        var updates = {};
        updates[`${this.node}/${userKey}/${newKey}`] = data

        return firebase.database().ref().update(updates).then(() => {
            Application.getData(Screen_Calendar);
        });
    }

}

let Holidays = new _Holidays();