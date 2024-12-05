const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');

Page({
	data: {
		isLoad: false
	},
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this, true)) return;
		if (!pageHelper.getOptions(this, options)) return;

		this._loadDetail();
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

	_loadDetail: async function () {
		if (!AdminBiz.isAdmin(this, true)) return;

		let id = this.data.id;
		if (!id) return;

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let mgr = await cloudHelper.callCloudData('admin/mgr_detail', params, opt);
		if (!mgr) {
			this.setData({
				isLoad: null
			})
			return;
		};

		this.setData({
			isLoad: true,
			formName: mgr.ADMIN_NAME,
			formDesc: mgr.ADMIN_DESC,
			formPhone: mgr.ADMIN_PHONE,
 
			formPassword: ''

		});
	},
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this, true)) return;

		let data = this.data;
		data = validate.check(data, AdminBiz.CHECK_FORM_MGR_EDIT, this);
		if (!data) return; 

		try {
			let adminId = this.data.id;
			data.id = adminId;

			await cloudHelper.callCloudSumbit('admin/mgr_edit', data).then(res => {

				let callback = () => {
					let node = {
						'ADMIN_NAME': data.name,
						'ADMIN_DESC': data.desc,
						'ADMIN_PHONE': data.phone,
					}
					pageHelper.modifyPrevPageListNodeObject(adminId, node);

					wx.navigateBack();
				}
				pageHelper.showSuccToast('修改成功', 1500, callback);
			});


		} catch (err) {
			console.log(err);
		}

	},
})