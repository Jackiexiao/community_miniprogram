const ProjectBiz = require('../../../biz/project_biz.js');
const pageHelper = require('../../../../../helper/page_helper.js');

Page({
	data: {
		isLoad: false,
		_params: null,
	},

	onLoad: function (options) {
		ProjectBiz.initPage(this);
		this.setData({
			isLoad: true
		});
	},

	onShow: function () {
		// 更新 tabBar 选中状态
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().init();
		}
	},

	onPullDownRefresh: function () {
		this.setData({
			_params: null
		});
		wx.stopPullDownRefresh();
	},

	onReachBottom: function () {
	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},
});
