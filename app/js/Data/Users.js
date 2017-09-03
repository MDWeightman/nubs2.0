class _Users extends Firebase {
    constructor() {
        super();
        this.node = 'users';
        this.data = null;
    }

    setData(data) {
        this.data = data;
    }

    getData() {
        return firebase.database().ref(`/${this.node}/`).once('value').then(snapshot => {
            this.setData(snapshot.val());
        });
    }
}

let Users = new _Users();