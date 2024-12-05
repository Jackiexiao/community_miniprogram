const AdminBiz = require('../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');

Page({
	data: {
		formContent: [{
			type: 'text',
			val: '',
		}]
	},
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		let formContent = parent.data.formContent;
		if (formContent && formContent.length > 0)
			this.setData({
				formContent
			});
	},
	onReady: function () {},
	onShow: function () {},
	onHide: function () {},
	onUnload: function () {},
	onPullDownRefresh: async function () {

	},

	model: function (e) {
		pageHelper.model(this, e);
	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	bindSaveTap: function (e) {
		let formContent = this.selectComponent("#contentEditor").getNodeList();

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		parent.setData({
			formContent
		}, () => {
			parent._setContentDesc();
		});

		wx.navigateBack();
	}
})