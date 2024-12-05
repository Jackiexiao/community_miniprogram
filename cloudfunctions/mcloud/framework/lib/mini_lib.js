const cloudBase = require('../cloud/cloud_base.js');
const cloudUtil = require('../cloud/cloud_util.js');
const config = require('../../config/config');
function fmtThing(str) { //20个以内字符,可汉字、数字、字母或符号组合
	return str.substr(0, 20);
}

function fmtCharacterString(str) { //32位以内数字、字母或符号
	return str.substr(0, 32);
}

function fmtPhrase(str) { //5个以内汉字
	return str.substr(0, 5);
} 
async function sendMiniOnceTempMsg(body, key = '') {
	let cloud = cloudBase.getCloud();
	try {
		body.lang = 'zh_CN';
		body.miniprogramState = 'formal';

		await cloud.openapi.subscribeMessage.send(body);
	} catch (err) {
		cloudUtil.log('##sendOnceTempMsg[' + key + ']', err);
	}
}
module.exports = {
	sendMiniOnceTempMsg,

	fmtThing,
	fmtCharacterString,
	fmtPhrase
}