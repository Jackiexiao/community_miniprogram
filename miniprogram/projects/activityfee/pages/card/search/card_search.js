const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');

Page({
	data: {
		search: '',
		list: null,

		tags: [
			'JavaScript', 'Python', 'Java',
			'Vue', 'React', 'Node.js',
			'Flutter', 'UI设计', '产品设计',
			'用户研究', '前端开发', '后端开发',
			'全栈开发', '产品经理', '设计师'
		],

		history: []
	},

	onLoad: function (options) {
		// 获取搜索历史
		this._loadHistory();
	},

	_loadHistory: function () {
		let history = wx.getStorageSync('card_search_history') || [];
		this.setData({
			history
		});
	},

	_saveHistory: function (value) {
		let history = this.data.history;
		
		// 去重
		let idx = history.indexOf(value);
		if (idx > -1) {
			history.splice(idx, 1);
		}

		// 限制数量
		if (history.length >= 10) {
			history.pop();
		}

		// 新值放到最前
		history.unshift(value);

		wx.setStorageSync('card_search_history', history);
		this.setData({
			history
		});
	},

	bindSearch: async function (e) {
		let search = this.data.search.trim();
		if (!search) return;

		try {
			let params = {
				search,
				sortType: 'sort',
				sortVal: '',
				orderBy: {
					'USER_ADD_TIME': 'desc'
				},
				page: 1,
				size: 50
			}

			let opts = {
				title: 'bar'
			}
			let result = await cloudHelper.dataList(this, 'card/list', params, opts);

			this.setData({
				list: result.list
			});

			// 保存搜索历史
			this._saveHistory(search);

		} catch (err) {
			console.error(err);
		}
	},

	bindHistoryTap: function (e) {
		let value = e.currentTarget.dataset.value;
		this.setData({
			search: value
		}, () => {
			this.bindSearch();
		});
	},

	bindTagTap: function (e) {
		let tag = e.currentTarget.dataset.tag;
		this.setData({
			search: tag
		}, () => {
			this.bindSearch();
		});
	},

	bindClearHistory: function () {
		wx.showModal({
			title: '提示',
			content: '确定要清除搜索历史吗？',
			success: res => {
				if (res.confirm) {
					wx.removeStorageSync('card_search_history');
					this.setData({
						history: []
					});
				}
			}
		})
	},

	url: function (e) {
		pageHelper.url(e, this);
	},
})
