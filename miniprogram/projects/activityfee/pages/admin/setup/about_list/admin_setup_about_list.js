const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const projectSetting = require('../../../../public/project_setting.js');
const pageHelper = require('../../../../../../helper/page_helper.js');

Page({
	data: {

	},
	onLoad(options) {
		if (!AdminBiz.isAdmin(this)) return;

		this.setData({
			list: projectSetting.SETUP_CONTENT_ITEMS
		});
	},
	onReady() {

	},
	onShow() {

	},
	onHide() {

	},
	onUnload() {

	},
	onPullDownRefresh() {

	},
	onReachBottom() {

	},

	url: function (e) {
		pageHelper.url(e, this);
	}
})