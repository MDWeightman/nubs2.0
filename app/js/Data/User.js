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
            //Application.Screen.set(Screen_Calendar);
        }, 1000);
    }

    update(user, fbUser) {
        let data = {
            firstName: fbUser.first_name,
            lastName: fbUser.first_name,
            displayName: fbUser.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            link: fbUser.link,
            gender: fbUser.gender,
            locale: fbUser.locale,
            uid: user.uid,
            fbUid: fbUser.id
        }
        var updates = {};
        updates[`/${this.node}/${data.uid}/firstName`] = data.firstName;
        updates[`/${this.node}/${data.uid}/lastName`] = data.lastName;
        updates[`/${this.node}/${data.uid}/displayName`] = data.displayName;
        updates[`/${this.node}/${data.uid}/gender`] = data.gender;
        updates[`/${this.node}/${data.uid}/email`] = data.email;
        updates[`/${this.node}/${data.uid}/phoneNumber`] = data.phoneNumber;
        updates[`/${this.node}/${data.uid}/photoURL`] = data.photoURL;
        updates[`/${this.node}/${data.uid}/uid`] = data.uid;
        updates[`/${this.node}/${data.uid}/uidFB`] = data.fbUid;
        updates[`/${this.node}/${data.uid}/locale`] = data.locale;
        updates[`/${this.node}/${data.uid}/link`] = data.link;
        updates[`/${this.node}/${data.uid}/phoneNumber`] = data.phoneNumber;
        this.data = data;
        firebase.database().ref().update(updates).then(() => {
            this.getUser(true);
        })
    }

    getFbUser(user) {
        FB.api(`/${user.providerData[0].uid}`, { fields: 'id,name,email,first_name,last_name,age_range,link,gender,locale,picture,timezone,updated_time,verified', access_token: '1758235390857038|c568abc88bd94a9dfef7de0283653e52' }, function(fbUser) {
            User.update(user, fbUser);
        });
    }

    getUser(render) {
        return firebase.database().ref(`/${this.node}/${this.data.uid}`).once('value').then(snapshot => {
            this.setData(snapshot.val(), render);
        });
    }

    loginDialog() {
        var provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        firebase.auth().signInWithPopup(provider).then(function(result) {
            var token = result.credential.accessToken;
            User.setToken(token);
            var user = result.user;
            User.getFbUser(user);
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            console.error(error);
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
            document.getElementById("appbar-user-name").innerHTML = this.data.firstName;
        }
        Application.render();
    }
}

let User = new _User();