const AppError = require('../core/app_error.js');
const cloudBase = require('../cloud/cloud_base.js');
const config = require('../../config/config.js');
async function checkImgClient(imgData, mine) {
	if (!config.CLIENT_CHECK_CONTENT) return;
	return await checkImg(imgData, mine);
}
async function checkImgAdmin(imgData, mine) {
	if (!config.ADMIN_CHECK_CONTENT) return;
	return await checkImg(imgData, mine);
}
async function checkImg(imgData, mine) {


	let cloud = cloudBase.getCloud();
	try {
		const result = await cloud.openapi.security.imgSecCheck({
			media: {
				contentType: 'image/' + mine,
				value: Buffer.from(imgData, 'base64') // 这里必须要将小程序端传过来的进行Buffer转化,否则就会报错,接口异常
			}

		})
		console.log('imgcheck', result);
		if (!result || result.errCode !== 0) {
			throw new AppError('图片内容不合适，请修改');
		}

	} catch (err) {
		console.log('imgcheck ex', err);
		throw new AppError('图片内容不合适，请修改');
	}

}
async function checkTextMultiAdmin(input) {
	if (!config.ADMIN_CHECK_CONTENT) return;
	return checkTextMulti(input);
}
async function checkTextMultiClient(input) {
	if (!config.CLIENT_CHECK_CONTENT) return;
	return checkTextMulti(input);
}
async function checkTextMulti(input) {

	let txt = '';
	for (let key in input) {
		if (typeof (input[key]) === 'string')
			txt += input[key];
		else if (typeof (input[key]) === 'object') //包括数组和对象
			txt += JSON.stringify(input[key]);
	}

	await checkText(txt);
}
async function checkTextAdmin(txt) {
	if (!config.ADMIN_CHECK_CONTENT) return;
	return checkText(txt);
}
async function checkTextClient(txt) {
	if (!config.CLIENT_CHECK_CONTENT) return;
	return checkText(txt);
}
async function checkText(txt) { 
	if (!txt) return; 
	let cloud = cloudBase.getCloud();
	try { 
		const result = await cloud.openapi.security.msgSecCheck({
			content: txt

		})
		if (!result || result.errCode !== 0) {
			throw new AppError('文字内容不合适，请修改或者重试');
		}

	} catch (err) {
		console.log('checkText ex', err);
		throw new AppError('文字内容不合适，请修改或者重试');
	}

}

module.exports = {
	checkImg,
	checkImgClient,
	checkImgAdmin,
	checkTextMulti,
	checkTextMultiClient,
	checkTextMultiAdmin,
	checkText,
	checkTextClient,
	checkTextAdmin
}