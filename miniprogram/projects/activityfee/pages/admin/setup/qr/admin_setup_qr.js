const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

Page({
	data: {
		isLoad: false,
		qrUrl: '',

		title: '',

		path: '',
		sc: '',
	},
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		if (options && options.qr && options.title) {
			this.setData({
				qr: decodeURIComponent(options.qr),
				title: decodeURIComponent(options.title),
			}, () => {
				this._loadDetail();
			});
		}
		else
			this._loadDetail();
	},

	_loadDetail: async function () {
		if (this.data.qr) {
			this.setData({
				qrUrl: this.data.qr,
				isLoad: true
			})
			return;
		}

		let path = pageHelper.fmtURLByPID('/pages/default/index/default_index');
		let params = {
			path 
		};
		let opt = {
			title: 'bar'
		};
		try {
			await cloudHelper.callCloudSumbit('admin/setup_qr', params, opt).then(res => {

				this.setData({
					qrUrl: res.data,
					isLoad: true
				});
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