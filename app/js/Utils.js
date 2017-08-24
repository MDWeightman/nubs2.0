class _Utils{
	constructor(){

	}
	makeKey(c) {
		if(!c){ c = 5}
		let key = "";
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(let i = 0; i < c; i++ ){
			key += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return key;
	}

	makeColor() {
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	isElementInViewport(el) {
		var rect = el.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document. documentElement.clientWidth)
		);
	}

	arrayContains(a, v) {
		for (var i = 0; i < a.length; i++) {
			if (a[i] === v) {
				return true;
			}
		}
		return false;
	}
	arrayContainsAt(a, v, i) {
		for (var x = 0; x < a.length; x++) {
			if (a[x][i] === v) {
				return true;
			}
		}
		return false;
	}

	arrayMove(a, v, i){
		for (var x = 0; x < a.length; x++) {
			if (a[x] === v) {
				a.splice(i, 0, x);
				a.splice(x+1, 1);
				break;
			}
		}
		return a;
	}
	arrayMoveAt(a, o, v, i){
		for (var x = 0; x < a.length; x++) {
			if (a[x][o] === v) {
				a.splice(i, 0, a[x]);
				a.splice(x+1, 1);
				break;
			}
		}
		return a;
	}
	
	sortArrayOn(arr, index){
		let s = arr.sort(function(a, b){
			let kA = a[index].toLowerCase();
			let kB = b[index].toLowerCase();
			if (kA < kB) {
				return -1 ;
			}
			if (kA > kB){
				return 1;
			}
			return 0;
		});
		return s;
	}
	
	sortObject(obj){
		let keys = [];
		let nObj = {};
		for(let key in obj){
			keys.push(key);
		}
		keys.sort(function(a,b){
			let kA = a.toLowerCase();
			let kB = b.toLowerCase();
			if(kA < kB){
				return -1;
			}
			if(kA > kB){
				return 1
			}
			return 0;
		});
		for(let i = 0; i < keys.length; i++){
			nObj[keys[i]] = obj[keys[i]];
		}
		return nObj;
	}
	
	sortObjectOn(obj, k){
		let keys = [];
		let nObj = {};
		for(let key in obj){
			keys.push({key:key, description: obj[key][k]});
		}
		keys.sort(function(a, b){
			if (a.description < b.description) {
				return -1 ;
			}
			if (a.description > b.description){
				return 1;
			}
			return 0;
		});
		for(let i = 0; i < keys.length; i++){
			nObj[keys[i].key] = obj[keys[i].key];
		}
		return nObj;
	}

}

let Utils = new _Utils();