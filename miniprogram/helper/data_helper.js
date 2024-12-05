const genRandomNum = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
const genRandomString = len => {
	const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const rdmIndex = text => Math.random() * text.length | 0;
	let rdmString = '';
	for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
	return rdmString;
}
const genRandomAlpha = len => {
	const text = 'abcdefghijklmnopqrstuvwxyz';
	const rdmIndex = text => Math.random() * text.length | 0;
	let rdmString = '';
	for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
	return rdmString;
}
function fmtTag(tag) {
	if (!tag || tag.constructor != String) return '';
	tag = tag.trim();
	tag = tag.replace(/，/g, ',');

	let arr = tag.split(',');
	let newArr = [];
	for (let k = 0; k < arr.length; k++) {
		arr[k] = arr[k].trim();
		if (arr[k].length > 0) newArr.push(arr[k]);
	}
	return newArr.join(',');
}
function spArr(arr, size) {
	if (!arr || !Array.isArray(arr) || arr.length == 0) return arr;

	let newArray = [];
	let index = 0;
	while (index < arr.length) {
		newArray.push(arr.slice(index, index += size));
	}
	return newArray;
}
function str2Arr(str, sp = ',') {
	if (str && Array.isArray(str)) return str;

	str = str.replace(/，/g, sp);
	let arr = str.split(sp);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = arr[i].trim();

		if (isNumber(arr[i])) {
			arr[i] = Number(arr[i]);
		}

	}
	return arr;
}
function isNumber(val) {
	var reg = /^[0-9]+.?[0-9]*$/;
	if (reg.test(val)) {
		return true;
	} else {
		return false;
	}
}
function getArrByKey(arr, key) {
	if (!Array.isArray(arr)) return;
	return arr.map((item) => {
		return item[key]
	});
}
function getArrByKeyMulti(arr, keys = []) {
	if (!Array.isArray(arr)) return;
	if (!Array.isArray(keys)) return;

	let ret = [];
	for (let k = 0; k < arr.length; k++) {
		let node = {};
		for (let j in keys) {
			node[keys[j]] = arr[k][keys[j]];
		}
		ret.push(node);
	}

	return ret;
}
function getDataByKey(arr, key, val) { 
	if (!Array.isArray(arr)) return null;

	for (let k = 0; k < arr.length; k++) {
		if (arr[k][key] == val)
			return arr[k];
	}

	return null;
}
function fmtText(content, len = -1) {
	if (!content) return content;
	
	let str = content.replace(/[\r\n]/g, ""); //去掉回车换行
	if (len > 0) {
		str = str.substr(0, len);
	}
	return str.trim();
}
function toHump(name) {
	name = name.replace(/\_(\w)/g, function (all, letter) {
		return letter.toUpperCase();
	});
	let firstChar = name.charAt(0).toUpperCase();
	return firstChar + name.slice(1);
}
function toLine(name) {
	name = name.replace(/([A-Z])/g, "_$1").toLowerCase();
	if (name.charAt(0) === '_')
		return name.slice(1);
	else
		return name;
}
function fmtMoneyShow(s, dot = ',', prefix = '¥') {
	if (s === '' || s === null || s === undefined) s = 0;
	
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(2) + "";
	var l = s.split(".")[0].split("").reverse(),
		r = s.split(".")[1];
	t = "";
	for (i = 0; i < l.length; i++) {
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? dot : "");
	}
	return prefix + t.split("").reverse().join("") + "." + r;
}
function fmtMoney(money) {
	money = Number(money);
	if (!money) money = 0;
	money = money.toFixed(2)
	money = Number(money);
	return money;
}
function arr2ObjectArr(arr, key1, key2, key3) {
	let ret = [];
	for (let k = 0; k < arr.length; k++) {
		let obj = {};
		if (key1) obj[key1] = arr[k];
		if (key2) obj[key2] = arr[k];
		if (key3) obj[key3] = arr[k];
		ret.push(obj);
	}
	return ret;
}
function objArrSortAsc(property) {
	return function (a, b) {
		var value1 = a[property];
		var value2 = b[property];
		if (value1 < value2)
			return -1;
		else if (value1 > value2)
			return 1;
		else return 0;
	}
}
function objArrSortDesc(property) {
	return function (a, b) {
		var value1 = a[property];
		var value2 = b[property];
		if (value1 < value2)
			return 1;
		else if (value1 > value2)
			return -1;
		else return 0;
	}
}
function arrAddDel(arr, data, sort = 'asc') {
	if (!arr) return arr;
	if (!Array.isArray(arr)) return arr;

	let idx = arr.indexOf(data);
	if (idx > -1)
		arr.splice(idx, 1);
	else
		arr.push(data)

	if (sort == 'asc')
		return arr.sort();
	else
		return arr.reverse();
} 
function deepClone(data) {
	if (data === null || typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean' || typeof data === 'undefined') {
		return data;
	}

	return JSON.parse(JSON.stringify(data));
}

function padLeft(str, len, charStr) {
	if (!str)
		str = '';
	else
		str = str + '';
	return new Array(len - str.length + 1).join(charStr || '') + str;
}

function padRight(str, len, charStr) {
	if (!str)
		str = '';
	else
		str = str + '';
	return str + new Array(len - str.length + 1).join(charStr || '');
}
function getSelectOptions(str) {
	if (!str)
		return [];
	else if (str.includes('=')) {
		let arr = str.split(',');
		for (let k = 0; k < arr.length; k++) {
			let node = arr[k].split('=');
			arr[k] = {};

			let labelArr = node[1].split('|');
			arr[k].label = labelArr[0];
			if (labelArr.length > 1) { //扩展属性
				arr[k].ext = labelArr[1];
			}
			arr[k].val = node[0];
		}
		return arr;
	} else {
		return str.split(',');
	}
}
function arraySwap(arr, index1, index2) {
	arr[index1] = arr.splice(index2, 1, arr[index1])[0];
	return arr;
}
function arrayTop(arr, idx) {
	let node = arr.splice(idx, 1)[0];
	arr.unshift(node);
	return arr;
}
function arrayBottom(arr, idx) {
	let node = arr.splice(idx, 1)[0];
	arr.push(node);
	return arr;
}
function insertObjArrByKey(arr, key, val, obj) {
	if (!arr) return arr;

	for (let k = 0; k < arr.length; k++) {
		if (arr[k][key] == val) {
			arr[k].list.push(obj);
			return arr;
		}
	}
	let newObj = {
		[key]: val,
		list: [obj]
	}
	arr.push(newObj);
	return arr;
}
function getValFromArr(arr, key = 'val', val = '') {
	if (!Array.isArray(arr)) return null;
	for (let k = 0; k < arr.length; k++) {
		if (arr[k][key] == val)
			return arr[k];
	}

	return null;
}


module.exports = {
	arrayTop,
	arraySwap,
	arrayBottom,

	fmtTag,

	getValFromArr,
	getArrByKey,
	getArrByKeyMulti, //提取对象数组的多个属性数组
	spArr, //拆分一维数组为二维
	getDataByKey,
	str2Arr,
	arr2ObjectArr,
	insertObjArrByKey,
	arrAddDel,
	objArrSortAsc,
	objArrSortDesc,

	arrAddDel,
	isNumber,

	padLeft,
	padRight,

	genRandomString, // 随机字符串
	genRandomAlpha,
	genRandomNum, // 随机数字 
	fmtText, // 文本内容格式化处理
	fmtMoneyShow, //金额格式化
	fmtMoney,

	toHump,
	toLine,

	getSelectOptions, //选项表单处理

	deepClone

}