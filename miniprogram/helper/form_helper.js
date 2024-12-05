 function model2Form(model) {
 	let newModel = {};
 	for (let key in model) {
 		let arr = key.split('_');
 		let result = '';
 		for (let i = 1; i < arr.length; i++) {
 			let name = arr[i].toLowerCase();
 			name = name.charAt(0).toUpperCase() + name.slice(1);
 			result = result + name;
 		}

 		newModel['form' + result] = model[key];
 	}
 	return newModel;
 }
 function setOptions(that, options, name, val) {
 	let idx = options.indexOf(val);
 	idx = (idx < 0) ? 0 : idx;
 	that.setData({
 		[name]: idx
 	})
 }

 module.exports = {
 	model2Form,
 	setOptions
 }