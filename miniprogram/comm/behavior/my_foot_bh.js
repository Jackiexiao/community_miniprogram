const FootBiz = require('../biz/foot_biz.js');
const pageHelper = require('../../helper/page_helper.js');

module.exports = Behavior({
	data: {
	},

	methods: {
		onLoad: async function (options) {
			this._loadList();
		},

		_loadList: async function (e) {
			let footList = FootBiz.getFootList();
			this.setData({
				footList
			});
		},
		onReady: function () {

		},
		onShow: function () {

		},
		onHide: function () {

		},
		onUnload: function () {

		},
		onPullDownRefresh: async function () {
			await this._loadList();
			wx.stopPullDownRefresh();
		},
		onReachBottom: function () {

		},

		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})