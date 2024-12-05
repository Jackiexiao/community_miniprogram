const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');
const dataHelper = require('../../../../../../helper/data_helper.js');
const ActivityBiz = require('../../../../biz/activity_biz.js');
const AdminActivityBiz = require('../../../../biz/admin_activity_biz.js');
const formSetHelper = require('../../../../../../cmpts/public/form/form_set_helper.js');
const projectSetting = require('../../../../public/project_setting.js');

Page({
    data: {
        isLoad: false,
    },
    onLoad: async function (options) {
        if (!AdminBiz.isAdmin(this)) return;
        if (!pageHelper.getOptions(this, options)) return;

        wx.setNavigationBarTitle({
            title: projectSetting.ACTIVITY_NAME + '-修改',
        });

        this._loadDetail();
    },
    onReady: function () { },
    onShow: function () { },
    onHide: function () { },
    onUnload: function () { },
    onPullDownRefresh: async function () {
        await this._loadDetail();
        this.selectComponent("#cmpt-form").reload();
        wx.stopPullDownRefresh();
    },

    model: function (e) {
        pageHelper.model(this, e);
    },

    _loadDetail: async function () {
        if (!AdminBiz.isAdmin(this)) return;

        let id = this.data.id;
        if (!id) return;

        if (!this.data.isLoad) this.setData(AdminActivityBiz.initFormData(id)); // 初始化表单数据

        let params = {
            id
        };
        let opt = {
            title: 'bar'
        };
        let activity = await cloudHelper.callCloudData('admin/activity_detail', params, opt);
        if (!activity) {
            this.setData({
                isLoad: null
            })
            return;
        };

        if (!Array.isArray(activity.ACTIVITY_JOIN_FORMS) || activity.ACTIVITY_JOIN_FORMS.length == 0)
            activity.ACTIVITY_JOIN_FORMS = projectSetting.ACTIVITY_JOIN_FIELDS;


        this.setData({
            isLoad: true,

            formTitle: activity.ACTIVITY_TITLE,
            formCateId: activity.ACTIVITY_CATE_ID,
            formOrder: activity.ACTIVITY_ORDER,

            formMaxCnt: activity.ACTIVITY_MAX_CNT,
            formStart: activity.ACTIVITY_START,
            formEnd: activity.ACTIVITY_END,
            formStop: activity.ACTIVITY_STOP,

            formMethod: activity.ACTIVITY_METHOD,
            formFee:  activity.ACTIVITY_FEE ,

            formAddress: activity.ACTIVITY_ADDRESS,
            formAddressGeo: activity.ACTIVITY_ADDRESS_GEO,

            formCheckSet: activity.ACTIVITY_CHECK_SET,
            formCancelSet: activity.ACTIVITY_CANCEL_SET,
            formIsMenu: activity.ACTIVITY_IS_MENU,

            formForms: activity.ACTIVITY_FORMS,
            formJoinForms: formSetHelper.initFields(activity.ACTIVITY_JOIN_FORMS),

        });

    },

    bindFormSubmit: async function () {
        if (!AdminBiz.isAdmin(this)) return;
        let data = this.data;
        data = validate.check(data, AdminActivityBiz.CHECK_FORM, this);
        if (!data) return;

        if (data.end < data.start) {
            return pageHelper.showModal('结束时间不能早于开始时间');
        }

        let forms = this.selectComponent("#cmpt-form").getForms(true);
        if (!forms) return;
        data.forms = forms;

        data.cateName = ActivityBiz.getCateName(data.cateId);

        try {
            let activityId = this.data.id;
            data.id = activityId;
            await cloudHelper.callCloudSumbit('admin/activity_edit', data).then(res => { 
                let node = {
                    'ACTIVITY_TITLE': data.title,
                    'ACTIVITY_CATE_NAME': data.cateName,
                    'ACTIVITY_ORDER': data.order,
                    'ACTIVITY_START': data.start,
                    'ACTIVITY_END': data.end,
                    'ACTIVITY_STOP': data.stop,
                    'ACTIVITY_METHOD': data.method,
                    'ACTIVITY_FEE': Number(data.fee),
                    'ACTIVITY_MAX_CNT': data.maxCnt,
                    'ACTIVITY_CHECK_SET': data.checkSet,
                    'ACTIVITY_CANCEL_SET': data.cancelSet,
                    'ACTIVITY_IS_MENU': data.isMenu,
                    statusDesc: res.data.statusDesc
                }
                pageHelper.modifyPrevPageListNodeObject(activityId, node);
            });

            await cloudHelper.transFormsTempPics(forms, 'activity/', activityId, 'admin/activity_update_forms');

            let callback = () => {
                wx.navigateBack();
            }
            pageHelper.showSuccToast('修改成功', 2000, callback);

        } catch (err) {
            console.log(err);
        }

    },

    bindMapTap: function (e) {
        AdminActivityBiz.selectLocation(this);
    },

    url: function (e) {
        pageHelper.url(e, this);
    },

    switchModel: function (e) {
        pageHelper.switchModel(this, e);
    },

    bindJoinFormsCmpt: function (e) {
        this.setData({
            formJoinForms: e.detail,
        });
    },

})