const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');  

Page({
	data: {
		name: '',
		pwd: '',
	},
	onLoad: function (options) {
		AdminBiz.clearAdminToken();
	},
	onReady: function () {

	},
	onShow: function () {},
	onHide: function () {

	},
	onUnload: function () {

	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindBackTap: function (e) {
		wx.reLaunch({
			url: pageHelper.fmtURLByPID('/pages/my/index/my_index'),
		});
	},

	bindLoginTap: async function (e) {
		return AdminBiz.adminLogin(this, this.data.name, this.data.pwd);
	}

})