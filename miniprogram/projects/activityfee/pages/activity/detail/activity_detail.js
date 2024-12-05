const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const ActivityBiz = require('../../../biz/activity_biz.js');

Page({
    data: {
        isLoad: false,
    },
    onLoad: async function (options) {
        ProjectBiz.initPage(this);
        if (!pageHelper.getOptions(this, options)) return;
        this._loadDetail();

        wx.setNavigationBarColor({
            backgroundColor: projectSetting.PROJECT_COLOR,
            frontColor: '#ffffff',
        })
    },

    _loadDetail: async function () {
        let id = this.data.id;
        if (!id) return;

        let params = {
            id,
        };
        let opt = {
            title: 'bar'
        };
        let activity = await cloudHelper.callCloudData('activity/view', params, opt);
        if (!activity) {
            this.setData({
                isLoad: null
            })
            return;
        }

        this.setData({
            isLoad: true,
            activity,
        });
    },
    onReady: function () { },
    onShow: function () { },
    onHide: function () { },
    onUnload: function () { },
    onPullDownRefresh: async function () {
        await this._loadDetail();
        wx.stopPullDownRefresh();
    },
    onReachBottom: function () { },

    bindJoinTap: async function (e) {
        if (!await PassportBiz.loginMustCancelWin(this)) return;

        wx.navigateTo({
            url: '../join/activity_join?id=' + this.data.activity._id,
        });
    },

    bindCancelJoinTap: async function (e) {
        console.log('[activity_detail.bindCancelJoinTap] Starting cancel join process');
        let loginResult = await PassportBiz.loginMustCancelWin(this);
        console.log('[activity_detail.bindCancelJoinTap] Login check result:', loginResult);
        
        if (!loginResult) {
            console.log('[activity_detail.bindCancelJoinTap] Login check failed, returning');
            return;
        }
        
        let cb = () => {
            console.log('[activity_detail.bindCancelJoinTap] Redirecting after cancel');
            wx.redirectTo({
                url: 'activity_detail?id=' + this.data.id,
            })
        }

        let isPay = this.data.activity.ACTIVITY_METHOD ? true : false;
        console.log('[activity_detail.bindCancelJoinTap] Calling cancelMyActivityJoin, isPay:', isPay);
        await ActivityBiz.cancelMyActivityJoin(this.data.activity.myActivityJoinId, cb, isPay);
    },

    bindOpenMapTap: function (e) {
        let address = pageHelper.dataset(e, 'address');
        let geo = pageHelper.dataset(e, 'geo');
        ActivityBiz.openMap(address, geo);
    },
    url: function (e) {
        pageHelper.url(e, this);
    },

    onPageScroll: function (e) {
        pageHelper.showTopBtn(e, this);

    },

    onShareAppMessage: function (res) {
        return {
            title: this.data.activity.ACTIVITY_TITLE,
            imageUrl: this.data.activity.ACTIVITY_OBJ.cover[0]
        }
    }
})