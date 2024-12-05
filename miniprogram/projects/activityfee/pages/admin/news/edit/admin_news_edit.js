const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');
const AdminNewsBiz = require('../../../../biz/admin_news_biz.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({
	data: {
		isLoad: false,
	},
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!pageHelper.getOptions(this, options)) return;

		wx.setNavigationBarTitle({
			title: projectSetting.NEWS_NAME + '-修改',
		});

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

	model: function (e) {
		pageHelper.model(this, e);
	},

	_loadDetail: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let id = this.data.id;
		if (!id) return;

		if (!this.data.isLoad) this.setData(AdminNewsBiz.initFormData(id)); // 初始化表单数据

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let news = await cloudHelper.callCloudData('admin/news_detail', params, opt);
		if (!news) {
			this.setData({
				isLoad: null
			})
			return;
		};

		this.setData({
			isLoad: true,

			imgList: news.NEWS_PIC,
			formCateId: news.NEWS_CATE_ID,
			formOrder: news.NEWS_ORDER,

			formTitle: news.NEWS_TITLE,
			formContent: news.NEWS_CONTENT,

			formDesc: news.NEWS_DESC,

			formForms: news.NEWS_FORMS,

		}, () => {
			this._setContentDesc();

		});
	},

	_setContentDesc: function () {
		AdminBiz.setContentDesc(this);
	},
	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;
		let data = this.data;
		if (this.data.formContent.length == 0) {
			return pageHelper.showModal('详细内容不能为空');
		}
		data = validate.check(data, AdminNewsBiz.CHECK_FORM, this);
		if (!data) return;

		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms; 

		data.cateName = AdminNewsBiz.getCateName(data.cateId);

		try {
			let newsId = this.data.id;
			data.id = newsId;

			if (this.data.imgList.length == 0) {
				return pageHelper.showModal('请上传封面图');
			}
			data.desc = PublicBiz.getRichEditorDesc(data.desc, this.data.formContent);
			await cloudHelper.callCloudSumbit('admin/news_edit', data);
			wx.showLoading({
				title: '提交中...',
				mask: true
			});
			await cloudHelper.transCoverTempPics(this.data.imgList, 'news/', newsId, 'admin/news_update_pic');
			let formContent = this.data.formContent;
			wx.showLoading({
				title: '提交中...',
				mask: true
			});
			let content = await cloudHelper.transRichEditorTempPics(formContent, 'news/', newsId, 'admin/news_update_content');
			this.setData({
				formContent: content
			});

			await cloudHelper.transFormsTempPics(forms, 'news/', newsId, 'admin/news_update_forms');

			let callback = async () => {
				let node = {
					'NEWS_TITLE': data.title,
					'NEWS_CATE_NAME': data.cateName,
					'NEWS_ORDER': data.order,
				}
				pageHelper.modifyPrevPageListNodeObject(newsId, node);

				wx.navigateBack();

			}
			pageHelper.showSuccToast('修改成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},


	bindImgUploadCmpt: function (e) {
		this.setData({
			imgList: e.detail
		});
	},


	url: function (e) {
		pageHelper.url(e, this);
	}

})