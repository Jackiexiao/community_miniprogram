const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');

Page({
	data: {
		formName: '',
		formDesc: '',
		formPhone: '',
		formPassword: '',
	},
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this, true)) return;
	},
	onReady: function () {

	},
	onShow: function () {

	},
	onHide: function () {

	},
	onUnload: function () {

	},
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this, true)) return;

		let data = this.data;
		data = validate.check(data, AdminBiz.CHECK_FORM_MGR_ADD, this);
		if (!data) return;

		try {
			let adminId = this.data.id;
			data.id = adminId;

			await cloudHelper.callCloudSumbit('admin/mgr_insert', data).then(res => {

				let callback = async function () {
					PublicBiz.removeCacheList('admin-mgr');
					wx.navigateBack();

				}
				pageHelper.showSuccToast('添加成功', 1500, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},
})