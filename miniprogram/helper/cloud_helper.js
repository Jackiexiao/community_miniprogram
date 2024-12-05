const helper = require('./helper.js');
const dataHelper = require('./data_helper.js');
const cacheHelper = require('./cache_helper.js');
const constants = require('../comm/constants.js');
const contentCheckHelper = require('../helper/content_check_helper.js');
const pageHelper = require('../helper/page_helper.js');
const timeHelper = require('../helper/time_helper.js');
const setting = require('../setting/setting.js');

const CODE = {
	SUCC: 200,
	SVR: 500, //服务器错误  
	LOGIC: 1600, //逻辑错误 
	DATA: 1301, // 数据校验错误 
	HEADER: 1302, // header 校验错误  

	ADMIN_ERROR: 2401, //管理员错误
	WORK_ERROR: 2501 //陪练员错误
};

class CloudHelper {
	static async callCloudSumbitAsync(route, params = {}, options) {
		if (!helper.isDefined(options)) options = {
			hint: false
		}
		if (!helper.isDefined(options.hint)) options.hint = false;
		return CloudHelper.callCloud(route, params, options)
	}

	static async callCloudSumbit(route, params = {}, options = { title: '提交中...' }) {
		if (!helper.isDefined(options)) options = {
			title: '提交中..'
		}
		if (!helper.isDefined(options.title)) options.title = '提交中..';
		return await CloudHelper.callCloud(route, params, options);
	}

	static async callCloudData(route, params = {}, options) {
		if (!helper.isDefined(options)) options = {
			title: '加载中..'
		}

		if (!helper.isDefined(options.title)) options.title = '加载中..';
		let result = await CloudHelper.callCloud(route, params, options).catch(err => {
			return null;
		});

		if (result && helper.isDefined(result.data)) {
			result = result.data;
			if (Array.isArray(result)) {
			} else if (Object.keys(result).length == 0) {
				result = null; //对象处理
			}

		}
		return result;
	}

	static async callCloud(route, params = {}, options) {

		let title = 'loading'; //默认提示
		let hint = true; //默认显示提示

		// 传入参数处理
		if (options && options.title != undefined) {
			title = options.title;
			hint = options.title == false ? false : true;
		}

		if (hint) {
			if (title == 'bar')
				wx.showNavigationBarLoading();
			else
				wx.showLoading({
					title: title,
					mask: true
				})
		}

		let token = '';
		// 确保route是字符串类型
		if (!route || typeof route !== 'string') {
			console.error('Route must be a string');
			return Promise.reject(new Error('Route must be a string'));
		}
		
		if (route.indexOf('admin/') > -1) {
			let admin = cacheHelper.get(constants.CACHE_ADMIN);
			if (admin && admin.token) token = admin.token;
		} else if (route.indexOf('work/') > -1) { 
			let work = cacheHelper.get(constants.CACHE_WORK);
			if (work && work.token) token = work.token;
		} else {
			let user = cacheHelper.get(constants.CACHE_TOKEN);
			if (user && user.token) token = user.token;  
		}

		return new Promise(function (resolve, reject) {

			let PID = pageHelper.getPID();

			wx.cloud.callFunction({
				name: 'mcloud',
				data: {
					route: route,
					token,
					PID,
					params
				},
				success: function (res) {
					if (res.result.code == CODE.LOGIC || res.result.code == CODE.DATA) {
						console.log(res)
						if (hint) {
							wx.showModal({
								title: '温馨提示',
								content: res.result.msg,
								showCancel: false
							});
						}

						reject(res.result);
						return;
					} else if (res.result.code == CODE.ADMIN_ERROR) {
						wx.reLaunch({
							url: pageHelper.fmtURLByPID('/pages/admin/index/login/admin_login'),
						});
						return;

					} else if (res.result.code == CODE.WORK_ERROR) {
						wx.reLaunch({
							url: pageHelper.fmtURLByPID('/pages/work/index/login/work_login'),
						});
						return;
					}
					else if (res.result.code != CODE.SUCC) {
						if (hint) {
							wx.showModal({
								title: '温馨提示',
								content: '系统开小差了，请稍后重试',
								showCancel: false
							});
						}
						reject(res.result);
						return;
					}

					resolve(res.result);
				},
				fail: function (err) {
					if (hint) {
						console.log(err)
						if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.includes('Environment not found')) {
							wx.showModal({
								title: '',
								content: '未找到云环境ID',
								showCancel: false
							});

						} else if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.includes('FunctionName')) {
							wx.showModal({
								title: '',
								content: '云函数未创建或者未上传',
								showCancel: false
							});

						} else if (err && err.errMsg && err.errMsg.includes('-501000') && err.errMsg.includes('performed in the current function state')) {
							wx.showModal({
								title: '',
								content: '云函数正在上传中或者上传有误，请稍候',
								showCancel: false
							});
						} else
							wx.showModal({
								title: '',
								content: '网络故障，请稍后重试',
								showCancel: false
							});
					}
					reject(err.result);
					return;
				},
				complete: function (res) {
					if (hint) {
						if (title == 'bar')
							wx.hideNavigationBarLoading();
						else
							wx.hideLoading();
					}
				}
			});
		});
	}

	static async dataList(that, listName, route, params, options, isReverse = false) {

		console.log('dataList begin');

		// 确保route是字符串类型
		if (!route || typeof route !== 'string') {
			console.error('Route must be a string');
			return;
		}

		if (!helper.isDefined(that.data[listName]) || !that.data[listName]) {
			let data = {};
			data[listName] = {
				page: 1,
				size: 20,
				list: [],
				count: 0,
				total: 0,
				oldTotal: 0
			};
			that.setData(data);
		}

		if (!helper.isDefined(params.isTotal))
			params.isTotal = true;

		let page = params.page;
		let count = that.data[listName].count;
		if (page > 1 && page > count) {
			wx.showToast({
				duration: 500,
				icon: 'none',
				title: '没有更多数据了',
			});
			return;
		}

		for (let key in params) {
			if (!helper.isDefined(params[key]))
				delete params[key];
		}

		let oldTotal = 0;
		if (that.data[listName] && that.data[listName].total)
			oldTotal = that.data[listName].total;
		params.oldTotal = oldTotal;
		await CloudHelper.callCloud(route, params, options).then(function (res) {
			console.log('cloud begin');

			let dataList = res.data;
			let tList = that.data[listName].list;

			if (dataList.page == 1) {
				tList = res.data.list;
			} else if (dataList.page > that.data[listName].page) {
				if (isReverse)
					tList = res.data.list.concat(tList);
				else
					tList = tList.concat(res.data.list);
			} else
				return;

			dataList.list = tList;
			let listData = {};
			listData[listName] = dataList;

			that.setData(listData);

			console.log('cloud END');
		}).catch(err => {
			console.log(err)
		});

		console.log('dataList END');

	}

	static async getTempFileURLOne(fileID) {
		if (!fileID) return '';

		let result = await wx.cloud.getTempFileURL({
			fileList: [fileID],
		})
		if (result && result.fileList && result.fileList[0] && result.fileList[0].tempFileURL)
			return result.fileList[0].tempFileURL;
		return '';
	}

	static async transTempPics(imgList, dir, id, prefix = '') {
		if (setting.IS_DEMO) return imgList; 

		if (prefix && !prefix.endsWith('_')) prefix += '_';
		if (!id) id = timeHelper.time('YMD');

		for (let i = 0; i < imgList.length; i++) {

			let filePath = imgList[i];
			let ext = filePath.match(/\.[^.]+?$/)[0];
			if (filePath.includes('tmp') || filePath.includes('temp') || filePath.includes('wxfile')) {

				let rd = prefix + dataHelper.genRandomNum(1000000, 9999999);
				let cloudPath = id ? dir + id + '/' + rd + ext : dir + rd + ext;

				if (pageHelper.getPID())
				cloudPath = pageHelper.getPID() + '/' + cloudPath;


				await wx.cloud.uploadFile({
					cloudPath,
					filePath: filePath, // 文件路径
				}).then(res => {
					imgList[i] = res.fileID;
				}).catch(error => {
					console.error(error);
				})
			}
		}

		return imgList;
	}

	static async transRichEditorTempPics(content, dir, id, route) {

		let imgList = [];
		for (let k = 0; k < content.length; k++) {
			if (content[k].type == 'img') {
				imgList.push(content[k].val);
			}
		}
		imgList = await CloudHelper.transTempPics(imgList, dir, id, 'rich');
		let imgIdx = 0;
		for (let k = 0; k < content.length; k++) {
			if (content[k].type == 'img') {
				content[k].val = imgList[imgIdx];
				imgIdx++;
			}
		}
		let params = {
			id,
			content
		}

		try {
			await CloudHelper.callCloudSumbit(route, params);
			return content;
		} catch (e) {
			console.error(e);
		}

		return [];
	}

	static async transCoverTempPics(imgList, dir, id, route) {
		imgList = await CloudHelper.transTempPics(imgList, dir, id, 'cover');
		let params = {
			id,
			imgList: imgList
		}

		try {
			let res = await CloudHelper.callCloudSumbit(route, params);
			return res.data.urls;
		} catch (err) {
			console.error(err);
		}
	}

	static async transFormsTempPics(forms, dir, id, route) {
		wx.showLoading({
			title: '提交中...',
			mask: true
		});

		let hasImageForms = [];
		for (let k = 0; k < forms.length; k++) {
			if (forms[k].type == 'image') {
				forms[k].val = await CloudHelper.transTempPics(forms[k].val, dir, id, 'image');
				hasImageForms.push(forms[k]);
			}
			else if (forms[k].type == 'content') {
				let contentVal = forms[k].val;
				for (let j in contentVal) {
					if (contentVal[j].type == 'img') {
						let ret = await CloudHelper.transTempPics([contentVal[j].val], dir, id, 'content');
						contentVal[j].val = ret[0];
					}
				}
				hasImageForms.push(forms[k]);
			}
		}

		if (hasImageForms.length == 0) return;

		let params = {
			id,
			hasImageForms
		}

		try {
			await CloudHelper.callCloudSumbit(route, params);
		} catch (err) {
			console.error(err);
		}
	}

	static async transTempPicOne(img, dir, id, isCheck = true) {

		if (isCheck) {
			wx.showLoading({
				title: '图片校验中',
				mask: true
			});
			let check = await contentCheckHelper.imgCheck(img);
			if (!check) {
				wx.hideLoading();
				return pageHelper.showModal('不合适的图片, 请重新上传', '温馨提示');
			}
			wx.hideLoading();
		}

		let imgList = [img];
		imgList = await CloudHelper.transTempPics(imgList, dir, id);

		if (imgList.length == 0)
			return '';
		else {
			return imgList[0];
		}


	}

	static async callCloudSumbit(route, params, options = { title: 'bar' }) {
		try {
			console.log('[CloudHelper.callCloudSumbit] Calling cloud function:', { route, params });
			let res = await wx.cloud.callFunction({
				name: 'mcloud',
				data: {
					route,
					params,
					PID: 'activityfee'
				}
			});
			console.log('[CloudHelper.callCloudSumbit] Cloud function response:', res);

			if (!res || !res.result) {
				console.error('[CloudHelper.callCloudSumbit] No result from cloud function');
				return null;
			}

			let result = res.result;
			if (result.code != 200) {
				console.error('[CloudHelper.callCloudSumbit] API error:', result);
				throw new Error(result.msg || '操作失败');
			}

			return result;
		} catch (err) {
			console.error('[CloudHelper.callCloudSumbit] Exception:', err);
			throw new Error('操作失败，请重试');
		}
	}
}

module.exports = CloudHelper;