class _User extends Firebase {
    constructor() {
        super();
        this.node = 'users';
        this.token = null;
        this.data = null;
        this.authenticated = false;
    }

    setToken(token) {
        this.token = token;
    }

    setData(data, render) {
        this.data = data;
        console.log(this.node, this.data);
        this.login();
        if (this.data && render) {
            this.render();
        }
    }

    setLogin() {
        if (!this.isAuthenticated()) {
            document.getElementById("appbar-user-name").addEventListener("click", User.loginDialog);
        } else {
            document.getElementById("appbar-user-name").removeEventListener("click", User.loginDialog);
        }
        setTimeout(() => {
            Application.Screen.set(Screen_Calendar);
        }, 1000);
    }

    updateUser(user) {
        let data = {
            name: user.displayName.split(" ")[0],
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            uid: user.uid
        }
        var updates = {};
        updates[`/${this.node}/${data.uid}/name`] = data.name;
        updates[`/${this.node}/${data.uid}/displayName`] = data.displayName;
        updates[`/${this.node}/${data.uid}/email`] = data.email;
        updates[`/${this.node}/${data.uid}/phoneNumber`] = data.phoneNumber;
        updates[`/${this.node}/${data.uid}/photoURL`] = data.photoURL;
        updates[`/${this.node}/${data.uid}/uid`] = data.uid;
        this.data = data;
        firebase.database().ref().update(updates).then(() => {
            this.getUser(true);
        })
    }

    addBand(bandKey) {
        if (!this.data.bands) {
            this.data.bands = {}
        }
        this.data.bands[bandKey] = "";
        return this.updateBands();
    }

    removeBand(bandKey) {
        delete this.data.bands[bandKey]
        return this.updateBands();
    }

    updateBands() {
        var bands = {};
        if (this.data.bands) {
            for (let k in this.data.bands) {
                bands[k] = Bands.data[k].name;
            }
            var updates = {};
            updates[`/${this.node}/${this.data.uid}/bands`] = bands;
            return firebase.database().ref().update(updates).then(() => {
                return this.getUser();
            });
        }
        return this.getUser();
    }

    getUser(render) {
        return firebase.database().ref(`/${this.node}/${this.data.uid}`).once('value').then(snapshot => {
            this.setData(snapshot.val(), render);
        });
    }

    loginDialog() {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            User.setToken(token);
            var user = result.user;
            User.updateUser(user);
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
    }

    login(remenber) {
        this.authenticated = true;
    }

    isAuthenticated() {
        return this.authenticated;
    }

    render() {
        this.setLogin();
        if (this.data.photoURL) {
            document.getElementById("appbar-user-avatar-image").src = this.data.photoURL;
        }
        if (this.data.displayName) {
            document.getElementById("appbar-user-avatar").classList.remove("hidden");
            document.getElementById("appbar-user-name").innerHTML = this.data.name;
        }
        Application.render();
    }
}

let User = new _User();