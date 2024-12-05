const SearchBiz = require('../../comm/biz/search_biz.js');
const pageHelper = require('../../helper/page_helper.js');

module.exports = Behavior({
	data: {
		type: '', // 来自哪个业务标识
		returnUrl: '', //搜索完返回哪个地址
		cacheName: '', //本业务搜索历史缓存
		search: '', //搜索关键字

		hisKeys: []
	},

	methods: {
		onLoad: async function (options) {
			let type = options.type;
			let returnUrl = options.returnUrl;

			let cacheName = 'SERACH_HIS_' + type;

			let hisKeys = SearchBiz.getHistory(cacheName);
			if (hisKeys)
				this.setData({
					hisKeys
				});

			this.setData({
				hisKeys,
				type,
				cacheName,
				returnUrl
			});

			if (options && options.source)
				this.setData({
					source: options.source,
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

		url: function (e) {
			pageHelper.url(e, this);
		},
		bindSearchConfirm: function (e) {

			if (!this.data.type) return;

			let search = this.data.search.trim();
			if (!search) return;
			let hisKeys = SearchBiz.addHistory(this.data.cacheName, search);
			this.setData({
				search,
				hisKeys
			});

			let prevPage = pageHelper.getPrevPage();
			prevPage.setData({
				search,
			})
			wx.navigateBack();

		},
		bindDelHisTap: function (e) {
			SearchBiz.clearHistory(this.data.cacheName);
			this.setData({
				hisKeys: []
			});
		},
		bindClearKeyTap: function (e) {
			this.setData({
				search: ''
			});
		},
		bindKeyTap: function (e) {
			let search = e.currentTarget.dataset.key.trim();
			if (search) {
				this.setData({
					search
				});
				this.bindSearchConfirm(e);
			}
		}
	}
})