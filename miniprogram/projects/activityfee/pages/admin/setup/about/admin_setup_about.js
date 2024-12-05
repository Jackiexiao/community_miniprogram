const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({
	data: {
		isLoad: false,
		key: '',

	},
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		if (options && options.key) {
			let key = options.key;
			for (let k = 0; k < projectSetting.SETUP_CONTENT_ITEMS.length; k++) {
				let item = projectSetting.SETUP_CONTENT_ITEMS[k];
				if (item.key == key) {
					this._loadDetail(item);
					wx.setNavigationBarTitle({
						title: '编辑' + item.title,
					});
					this.setData({ key: item.key });
					break;
				}
			}
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

	_loadDetail: async function (item) {
		if (!AdminBiz.isAdmin(this)) return;

		let opts = {
			'title': 'bar'
		};
		let params = {
			key: item.key
		}

		try {
			await cloudHelper.callCloudSumbit('home/setup_get', params, opts).then(res => {
				let formContent = [{ type: 'text', val: item.title }];
				let content = res.data;
				if (content && Array.isArray(content)) {
					formContent = content;
				}
				this.setData({
					isLoad: true,
					formContent

				});


			});
		}
		catch (err) {
			console.log(err);
		}


	},
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let formContent = this.selectComponent("#contentEditor").getNodeList();

		await cloudHelper.transRichEditorTempPics(formContent, 'setup/', this.data.key, 'admin/setup_set_content');

		let callback = () => {
			wx.navigateBack();
		}
		pageHelper.showSuccToast('修改成功', 1500, callback);

	},

})