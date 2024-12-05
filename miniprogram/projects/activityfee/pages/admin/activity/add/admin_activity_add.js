const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const AdminActivityBiz = require('../../../../biz/admin_activity_biz.js');
const ActivityBiz = require('../../../../biz/activity_biz.js');
const validate = require('../../../../../../helper/validate.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({
	data: {

	},
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		wx.setNavigationBarTitle({
			title: projectSetting.ACTIVITY_NAME + '-添加',
		});

		this.setData(AdminActivityBiz.initFormData());
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
	switchModel: function (e) {
		pageHelper.switchModel(this, e);
	},

	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let data = this.data;
		console.log("提交前的表单数据：", data);

		let checkData = validate.check(data, AdminActivityBiz.CHECK_FORM, this);
		if (!checkData) return;

		if (checkData.end < checkData.start) {
			return pageHelper.showModal('结束时间不能早于开始时间');
		}

		let submitData = {
			title: data.formTitle,
			cateId: data.formCateId,
			cateName: ActivityBiz.getCateName(data.formCateId),
			order: data.formOrder,

			maxCnt: data.formMaxCnt,
			start: data.formStart,
			end: data.formEnd,
			stop: data.formStop,

			method: data.formMethod,
			fee: data.formFee,

			address: data.formAddress || '',
			addressGeo: data.formAddressGeo || {},

			checkSet: data.formCheckSet,
			cancelSet: data.formCancelSet,
			isMenu: data.formIsMenu,

			forms: data.formForms || [],
			joinForms: data.formJoinForms || [],

			activityObj: {
				cover: [],
				time: 2,
				desc: [{
					type: 'text',
					val: '活动详情介绍'
				}],
				img: []
			}
		};

		console.log("最终提交的数据：", submitData);

		try {
			if (!submitData.title) return pageHelper.showModal('标题不能为空');
			if (!submitData.cateId) return pageHelper.showModal('请选择分类');
			if (!submitData.cateName) return pageHelper.showModal('分类名称不能为空');

			let result = await cloudHelper.callCloudSumbit('admin/activity_insert', submitData);
			let activityId = result.data.id;
			
			let callback = async function () {
				PublicBiz.removeCacheList('admin-activity-list');
				PublicBiz.removeCacheList('activity-list');
				wx.navigateBack();
			}
			pageHelper.showSuccToast('添加成功', 2000, callback);

		} catch (err) {
			console.error('提交错误：', err);
			pageHelper.showModal('添加失败，请重试');
		}
	},

	bindJoinFormsCmpt: function (e) {
		this.setData({
			formJoinForms: e.detail,
		});
	},

	bindMapTap: function (e) {
		AdminActivityBiz.selectLocation(this);
	}
})