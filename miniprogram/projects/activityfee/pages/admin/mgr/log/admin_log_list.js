const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

Page({
	data: {
	},
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this)) return;
		this.setData(this._getSearchMenu());

	},
	onReady: function () {

	},
	onShow: async function () { },
	onHide: function () {

	},
	onUnload: function () {

	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindClearTap: async function (e) {
		let cb = async () => {

			try {
				await cloudHelper.callCloudSumbit('admin/log_clear').then(res => {
					let cb = () =>{
						wx.redirectTo({
						  url: 'admin_log_list',
						})
					}
					pageHelper.showSuccToast('清空完成', 1500, cb);
				})
			}
			catch (err) {
				console.log(err);
			}
		}

		pageHelper.showConfirm('确认清空？清空不可恢复', cb);
	},

	_getSearchMenu: function () {

		let sortItems = [];
		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '系统', type: 'type', value: 0 },
			{ label: '用户', type: 'type', value: 1 },
			{ label: '文章', type: 'type', value: 2 },
			{ label: '其他', type: 'type', value: 99 }
		]

		return {
			search: '',
			sortItems,
			sortMenus,
			isLoad: true
		}

	}

})