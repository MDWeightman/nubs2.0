class Firebase{
	constructor(){
		this.database = firebase.database();
	}

	objListToArray(objList){
		var arr = [];
		for(var key in objList){
			var obj = objList[key];
			obj.key = key;
			arr.push(obj);
		}
		return arr;
	}
}