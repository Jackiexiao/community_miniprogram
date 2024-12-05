const pageHelper = require('../../helper/page_helper.js');
const cloudHelper = require('../../helper/cloud_helper.js'); 

module.exports = Behavior({
	data: {
		isLoad: false
	},

	methods: { 

		_loadDetail: async function (key, items, options = null) {
			let title = '';
			if (options && options.title) {
				title = decodeURIComponent(options.title);
				wx.setNavigationBarTitle({
					title
				});
			}
			else {
			for (let k = 0; k < items.length; k++) {
				if (items[k].key == key) {
					title = items[k].title;
					wx.setNavigationBarTitle({
						title
					});

					if (key == 'SETUP_CONTENT_ABOUT') {
						this.setData({
							accountInfo: wx.getAccountInfoSync()
						});
					}

					break;
				}
			}
			}

			let opts = {
				title: 'bar'
			}
			let params = {
				key
			}
			let about = await cloudHelper.callCloudData('home/setup_get', params, opts);
			if (!about) {
				about = [{ 'type': 'text', 'val': title }];
			}

			if (about) this.setData({
				about,
				isLoad: true
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
		onPullDownRefresh: function () {
			this._loadDetail();
			wx.stopPullDownRefresh();
		},
		onShareAppMessage: function () {

		},

		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})