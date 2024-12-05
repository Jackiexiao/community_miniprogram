const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	data: {
		list: null,
		isLoad: false,
		_params: null,
	},

	onLoad: async function (options) {
		if (!await PassportBiz.loginMustCancelWin(this)) return;

		this._loadList();
	},

	onPullDownRefresh: function () {
		this._loadList();
		wx.stopPullDownRefresh();
	},

	onReachBottom: function () {
		if (!this.data.isLoad) this._loadList();
	},

	_loadList: async function () {
		try {
			let params = {
				orderBy: 'ADD_TIME',
				sortType: 'desc',
				page: this.data.page || 1,
				size: 20
			};

			let opts = {
				title: 'bar'
			}
			await cloudHelper.dataList(this, 'card/my_fav_list', params, opts);
		} catch (err) {
			console.error(err);
		}
	},

	url: async function (e) {
		pageHelper.url(e, this);
	},
})
