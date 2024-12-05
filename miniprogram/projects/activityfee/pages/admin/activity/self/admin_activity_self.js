const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

Page({
	data: {
		isLoad: false,
		qrUrl: '',
	},
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return; 
		if (!pageHelper.getOptions(this, options, 'activityId'));

		if (options && options.title) {
			let title = decodeURIComponent(options.title);
			this.setData({
				title
			});
		}

		await this._loadDetail();
	},

	_loadDetail: async function () { 
		let activityId = this.data.activityId;

		let page = pageHelper.fmtURLByPID("/pages/activity/my_join_self/activity_my_join_self");

		let params = { 
			activityId,
			page
		};
		let opt = {
			title: 'bar'
		};
		try {
			await cloudHelper.callCloudSumbit('admin/activity_self_checkin_qr', params, opt).then(res => {
				this.setData({
					qrUrl: res.data,
					isLoad: true
				})
			});
		} catch (err) {
			console.error(err);
		}

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
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	url: function (e) {
		pageHelper.url(e, this);
	}

})