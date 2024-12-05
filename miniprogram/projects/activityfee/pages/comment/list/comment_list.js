const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	data: {
		isLoad: true,
		isAdmin: false,
	},
	onLoad: function (options) {
		ProjectBiz.initPage(this);

		if (!pageHelper.getOptions(this, options)) return;

		this.setData({
			nowUserId: PassportBiz.getUserId(),
			_params: { oid: this.data.id, isLoad: true }
		});

		if (options && options.source && options.source == 'admin') {
			this.setData({ isAdmin: true });
		}

	},
	onReady: function () {

	},
	onShow: function () {
		this.setData({
			nowUserId: PassportBiz.getUserId(),
		});
	},
	onHide: function () {

	},
	onUnload: function () {

	},
	onPullDownRefresh: function () {

	},
	onReachBottom: function () {

	},
	onShareAppMessage: function () {

	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindDelTap: async function (e) {

		let commentId = pageHelper.dataset(e, 'id');
		let cb = async () => {
			try {
				let params = {
					id: commentId,
					isAdmin: this.data.isAdmin
				}
				let opts = {
					title: '删除中'
				}

				await cloudHelper.callCloudSumbit('comment/del', params, opts).then(res => {
					let callback = () => {
						pageHelper.delListNode(commentId, this.data.dataList.list, '_id');
						this.data.dataList.total--;
						this.setData({
							dataList: this.data.dataList
						});
					}
					pageHelper.showSuccToast('删除成功', 1500, callback);
				});
			} catch (err) {
				console.log(err);
			}
		}

		pageHelper.showConfirm('确认删除?', cb);
	}
})