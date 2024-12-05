const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');

Page({
	data: {

	},
	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		if (options && options.scene) {
			let params = {
				activityId: options.scene
			};
			let opts = {
				title: 'bar'
			}
			try {
				await cloudHelper.callCloudSumbit('activity/my_join_self', params, opts).then(res => {
					let cb = () => {
						wx.reLaunch({
							url: '../../my/index/my_index',
						});
					}
					pageHelper.showModal(res.data.ret, '温馨提示', cb);
				});
			} catch (err) {
				console.error(err);
			}
		} else {
			pageHelper.showModal('签到码扫描错误，请关闭本小程序，使用「微信›扫一扫」重新扫码');
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
	onPullDownRefresh: function () {

	},
	onReachBottom: function () {

	},
	onShareAppMessage: function () {

	}
})