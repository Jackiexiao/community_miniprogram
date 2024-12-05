const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../../helper/cache_helper.js');
const cloudHelper = require('../../helper/cloud_helper.js');
const pageHelper = require('../../helper/page_helper.js');
const helper = require('../../helper/helper.js');
const constants = require('../constants.js');

class PassportBiz extends BaseBiz {
	static async loginSilence(that) {
		return await PassportBiz.loginCheck(false, 'slience', 'bar', that);
	}
	static async loginSilenceMust(that) {
		return await PassportBiz.loginCheck(false, 'must', 'bar', that);
	}
	static async loginMustCancelWin(that) {
		return await PassportBiz.loginCheck(true, 'cancel', '', that);
	}
	static async loginMustBackWin(that) {
		return await PassportBiz.loginCheck(true, 'back', '', that);
	}
	static getToken() {
		let token = cacheHelper.get(constants.CACHE_TOKEN);
		console.log('[PassportBiz.getToken] Current token:', token);
		return token || null;
	}
	static setToken(token) {
		if (!token) return;
		console.log('[PassportBiz.setToken] Setting token:', token);
		cacheHelper.set(constants.CACHE_TOKEN, token, constants.CACHE_TOKEN_EXPIRE);
	}
	static getUserId() {
		let token = cacheHelper.get(constants.CACHE_TOKEN);
		console.log('[PassportBiz.getUserId] Token:', token);
		if (!token) return '';
		return token.id || '';
	}
	static getUserName() {
		let token = cacheHelper.get(constants.CACHE_TOKEN);
		if (!token) return '';
		return token.name || '';
	}

	static getStatus() {
		let token = cacheHelper.get(constants.CACHE_TOKEN);
		if (!token) return -1;
		return token.status || -1;
	}
	static isLogin() {
		let id = PassportBiz.getUserId();
		return (id.length > 0) ? true : false;
	}

	static loginStatusHandler(method, status) {
		let content = '';
		if (status == 0) content = '您的注册正在审核中，暂时无法使用此功能！';
		else if (status == 8) content = '您的注册审核未通过，暂时无法使用此功能；请在个人中心修改资料，再次提交审核！';
		else if (status == 9) content = '您的账号已经禁用, 无法使用此功能！';
		if (method == 'cancel') {
			wx.showModal({
				title: '温馨提示',
				content,
				confirmText: '取消',
				showCancel: false
			});
		}
		else if (method == 'back') {
			wx.showModal({
				title: '温馨提示',
				content,
				confirmText: '返回',
				showCancel: false,
				success(result) {
					wx.navigateBack();
				}
			});
		}
		return false;
	}
	static async loginCheck(mustLogin = false, method = 'back', title = '', that = null) {
		console.log('[PassportBiz.loginCheck] Start - params:', { mustLogin, method, title });
		let token = cacheHelper.get(constants.CACHE_TOKEN);
		console.log('[PassportBiz.loginCheck] Current token:', token);
		
		if (token && method != 'must') {
			console.log('[PassportBiz.loginCheck] Token exists and valid');
			if (that)
				that.setData({
					isLogin: true
				});
			return true;
		} else {
			console.log('[PassportBiz.loginCheck] Token missing or invalid');
			if (that) that.setData({
				isLogin: false
			});
		}

		let opt = {
			title: title || '登录中',
		};

		let res = await cloudHelper.callCloudSumbit('passport/login', {}, opt).then(result => {
			console.log('[PassportBiz.loginCheck] Login API response:', result);
			
			if (result && result.data) {
				// 构造token对象
				let tokenData = {
					id: result.data.USER_ID,
					openId: result.data.USER_MINI_OPENID,
					name: result.data.USER_NAME,
					pic: result.data.USER_PIC,
					status: result.data.USER_STATUS
				};
				
				console.log('[PassportBiz.loginCheck] Constructed token:', tokenData);
				
				if (tokenData.status == 1) {
					console.log('[PassportBiz.loginCheck] Login successful, setting token');
					PassportBiz.setToken(tokenData);

					if (that) that.setData({
						isLogin: true
					});

					return true;
				}
				else if (mustLogin && (tokenData.status == 0 || tokenData.status == 8 || tokenData.status == 9)) {
					console.log('[PassportBiz.loginCheck] User status invalid:', tokenData.status);
					return PassportBiz.loginStatusHandler(method, tokenData.status);
				}
			}
			
			if (mustLogin && method == 'cancel') {
				wx.showModal({
					title: '温馨提示',
					content: '此功能仅限注册用户',
					confirmText: '马上注册',
					cancelText: '取消',
					success(result) {
						if (result.confirm) {
							let url = pageHelper.fmtURLByPID('/projects/activityfee/pages/my/reg/my_reg') + '?retUrl=back';
							wx.navigateTo({ url });

						} else if (result.cancel) {

						}
					}
				});

				return false;
			}
			else if (mustLogin && method == 'back') {
				wx.showModal({
					title: '温馨提示',
					content: '此功能仅限注册用户',
					confirmText: '马上注册',
					cancelText: '返回',
					success(result) {
						if (result.confirm) {
							let retUrl = encodeURIComponent(pageHelper.getCurrentPageUrlWithArgs());
							let url = pageHelper.fmtURLByPID('/projects/activityfee/pages/my/reg/my_reg') + '?retUrl=' + retUrl;
							wx.redirectTo({ url });
						} else if (result.cancel) {
							let len = getCurrentPages().length;
							if (len == 1) {
								let url = pageHelper.fmtURLByPID('/pages/default/index/default_index');
								wx.reLaunch({ url });
							}
							else
								wx.navigateBack();

						}
					}
				});

				return false;
			}

		}).catch(err => {
			console.log(err);
			PassportBiz.clearToken();
			return false;
		});

		return res;
	}
	static clearToken() {
		cacheHelper.remove(constants.CACHE_TOKEN);
	}
	static async getPhone(e) {
		if (e.detail.errMsg == "getPhoneNumber:ok") {
			let cloudID = e.detail.cloudID;
			let params = {
				cloudID
			};
			let opt = {
				title: '手机验证中'
			};
			try {
				let res = await cloudHelper.callCloudSumbit('passport/phone', params, opt);
				let phone = res.data;
				if (!phone || phone.length < 11) {
					wx.showToast({
						title: '手机号码获取失败，请重新填写手机号码',
						icon: 'none',
						duration: 2000
					});
					return null;
				}
				return { phone };
			} catch (err) {
				console.error(err);
				wx.showToast({
					title: '手机号码获取失败，请重新填写手机号码',
					icon: 'none'
				});
				return null;
			}
		} else {
			wx.showToast({
				title: '手机号码获取失败，请重新填写手机号码',
				icon: 'none'
			});
			return null;
		}
	}
}
PassportBiz.CHECK_FORM = {
	name: 'formName|must|string|min:1|max:30|name=昵称',
	mobile: 'formMobile|must|len:11|name=手机',
	forms: 'formForms|array'
};


module.exports = PassportBiz;