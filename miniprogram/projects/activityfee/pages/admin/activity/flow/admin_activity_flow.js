const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');

Page({
	data: {
		isLoad: false,
	},
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
		this._getSearchMenu();

	},
	onReady: function () { },
	onShow: async function () { },
	onHide: function () { },
	onUnload: function () { },

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},



	_getSearchMenu: function () {

		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '待支付', type: 'status', value: 0 },
			{ label: '已支付', type: 'status', value: 1 },
			{ label: '已退款', type: 'status', value: 8 },
			{ label: '失败', type: 'status', value: 9 },
			{ label: '已关闭', type: 'status', value: 10 },
			{ label: '无需支付', type: 'status', value: 99 },
		]
		this.setData({
			search: '',
			sortItems: [],
			sortMenus,
			isLoad: true
		})
	}

})