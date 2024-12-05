const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const CommentBiz = require('../../../biz/comment_biz.js');
const validate = require('../../../../../helper/validate.js');
const PublicBiz = require('../../../../../comm/biz/public_biz.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
	data: {
		isLoad: false
	},
	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		if (!await PassportBiz.loginMustBackWin(this)) return;
		
		if (!pageHelper.getOptions(this, options)) return;

		this.setData(CommentBiz.initFormData());
		this.setData({
			isLoad: true
		});
	},
	onReady: function () { },
	onShow: function () { },
	onHide: function () { },
	onUnload: function () { },

	url: function (e) {
		pageHelper.url(e, this);
	},


	bindFormSubmit: async function () {

		let data = this.data;
		data = validate.check(data, CommentBiz.CHECK_FORM, this);
		if (!data) return;


		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;
		data.oid = this.data.id;

		try {
			let result = await cloudHelper.callCloudSumbit('comment/insert', data);
			let commentId = result.data.id;
			await cloudHelper.transFormsTempPics(forms, 'comment/', commentId, 'comment/update_forms');

			let callback = async function () {
				PublicBiz.removeCacheList('admin-comment-list');
				PublicBiz.removeCacheList('comment-list');
				wx.navigateBack();

			}
			pageHelper.showSuccToast('发表成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}
	},


})