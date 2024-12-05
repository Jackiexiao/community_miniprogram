const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');

Page({
	data: {
		formOldPassword: '',
		formPassword: '',
		formPassword2: '',
	},
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this)) return;
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
		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;
		data = validate.check(data, AdminBiz.CHECK_FORM_MGR_PWD, this);
		if (!data) return;

		if (data.password != data.password2) {
			return pageHelper.showModal('两次输入的新密码不一致');
		}

		try {
			await cloudHelper.callCloudSumbit('admin/mgr_pwd', data).then(res => {
				let callback = () => {
					wx.navigateBack();
				}
				pageHelper.showSuccToast('修改成功', 1500, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},
})