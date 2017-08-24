class _Gigs extends Firebase {
    constructor() {
        super();
        this.data = null;
        this.node = 'gigs';
    }

    setData(data) {
        this.data = data;
        console.log(this.node, this.data);
    }

    getGigs() {
        return firebase.database().ref(`/${this.node}`).on('value', snapshot => {
            this.setData(snapshot.val());
        });
    }

    createGig(bandKey, data) {
        var newKey = firebase.database().ref().child(`${this.node}/${bandKey}`).push().key;
        var updates = {};
        updates[`${this.node}/${bandKey}/${newKey}`] = data

        return firebase.database().ref().update(updates).then(() => {
            Application.getData(Screen_Calendar);
        });
    }

}

let Gigs = new _Gigs();