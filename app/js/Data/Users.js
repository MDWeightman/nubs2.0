class _Users extends Firebase {
    constructor() {
        super();
		this.node = 'users';
		this.locales = [];
		this.genders = [];
        this.data = null;
    }

    setData(data) {
		this.data = data;
		this.setLocales();
		this.setGenders();
	}
	
	setLocales(){
		let locales = {}
		for(let k in this.data){
			let locale = this.data[k].locale;
			if(!locales[locale]){
				locales[locale] = locale;
			}
		}
		for(let k in locales){
			this.locales.push(k);
		}
	}
	
	setGenders(){
		let genders = {}
		for(let k in this.data){
			let gender = this.data[k].gender;
			if(!genders[gender]){
				genders[gender] = gender;
			}
		}
		for(let k in genders){
			this.genders.push(k);
		}
	}

    getData() {
        return firebase.database().ref(`/${this.node}/`).once('value').then(snapshot => {
            this.setData(snapshot.val());
        });
    }
}

let Users = new _Users();