class _Practices extends Firebase {
    constructor() {
        super();
        this.data = null;
        this.node = 'practices';
    }

    setData(data) {
        this.data = data;
        console.log(this.node, this.data);
    }

    getPractices() {
        return firebase.database().ref(`/${this.node}`).on('value', snapshot => {
            this.setData(snapshot.val());
        });
    }

    createPractice(bandKey, data) {
        var newKey = firebase.database().ref().child(`${this.node}/${bandKey}`).push().key;
        var updates = {};
        updates[`${this.node}/${bandKey}/${newKey}`] = data

        return firebase.database().ref().update(updates).then(() => {
            Application.getData(Screen_Calendar);
        });
    }

}

let Practices = new _Practices();