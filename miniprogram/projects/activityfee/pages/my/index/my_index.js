const cacheHelper = require('../../../../../helper/cache_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const AdminBiz = require('../../../../../comm/biz/admin_biz.js');
const setting = require('../../../../../setting/setting.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	data: {
	},
	onLoad: async function (options) {
		if (PassportBiz.isLogin()) {
			let user = {};
			user.USER_NAME = PassportBiz.getUserName();
			this.setData({ user });
		}

		ProjectBiz.initPage(this);

	},
	onReady: function () { },
	onShow: async function () {  
		PassportBiz.loginSilenceMust(this); 
		this._loadUser();

		// 更新 tabBar 选中状态
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().init();
		}
	},
	onHide: function () {

	},
	onUnload: function () {

	},

	_loadUser: async function (e) {

		let opts = {
			title: 'bar'
		}
		let user = await cloudHelper.callCloudData('passport/my_detail', {}, opts);
		if (!user) {
			this.setData({
				user: null
			});
			return;
		}

		this.setData({
			user
		})
	},
	onPullDownRefresh: async function () { 
		await this._loadUser();
		wx.stopPullDownRefresh();
	},
	onReachBottom: function () {

	},
	onShareAppMessage: function () { },

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindClearCache: function() {
		cacheHelper.clear();
		pageHelper.showNoneToast('清除缓存成功');
	},

	bindAdminLogin: function() {
		wx.navigateTo({
			url: '../../admin/index/login/admin_login',
		});
	},
})