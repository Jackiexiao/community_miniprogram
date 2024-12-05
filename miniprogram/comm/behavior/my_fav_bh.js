const pageHelper = require('../../helper/page_helper.js');
const cloudHelper = require('../../helper/cloud_helper.js');

module.exports = Behavior({
	data: {
	},

	methods: {
		onLoad: async function (options) {
		},

		myCommListListener: function (e) {
			pageHelper.commListListener(this, e);
		},
		onReady: function () {

		},
		onShow: function () {

		},
		onHide: function () {

		},
		onUnload: function () {

		},
		onReachBottom: function () {

		},

		url: function (e) {
			pageHelper.url(e, this);
		},

		bindDelTap: async function (e) {

			let oid = e.currentTarget.dataset.oid;
			if (!oid) return;
			let that = this;
			let callback = async function () {
				await cloudHelper.callCloudSumbit('fav/del', {
					oid
				}).then(res => {
					pageHelper.delListNode(oid, that.data.dataList.list, 'FAV_OID');
					that.data.dataList.total--;
					that.setData({
						dataList: that.data.dataList
					});
					pageHelper.showSuccToast('删除成功');
				}).catch(err => {
					console.log(err);
				 });
			}
			pageHelper.showConfirm('您确认删除？', callback);
		}
	}
})