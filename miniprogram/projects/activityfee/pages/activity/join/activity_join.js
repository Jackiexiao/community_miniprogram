const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
    data: {
        isLoad: false,

        forms: [],
    },
    onLoad: async function (options) {
        ProjectBiz.initPage(this);
        if (!pageHelper.getOptions(this, options)) return;

        if (!await PassportBiz.loginMustBackWin(this)) return;

        this._loadDetail();

    },

    bindAddressTap: function (e) {
        let idx = pageHelper.dataset(e, 'idx');
        let activity = this.data.activity;
        let myForms = activity.addressList2[idx];

        this.setData({
            'activity.myForms': myForms
        }, () => {
            this.selectComponent('#form-show').reload();
        });




    },

    _loadDetail: async function () {
        let id = this.data.id;
        if (!id) return;


        let params = {
            activityId: id
        };
        let opt = {
            title: 'bar'
        };
        let activity = await cloudHelper.callCloudData('activity/detail_for_join', params, opt);
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
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: async function () {
        this.setData({
            isLoad: false
        }, async () => {
            await this._loadDetail();
        })
        wx.stopPullDownRefresh();
    },



    url: function (e) {
        pageHelper.url(e, this);
    },

    onPageScroll: function (e) {
        pageHelper.showTopBtn(e, this);

    },

    bindCheckTap: async function (e) {
        this.selectComponent("#form-show").checkForms();
    },

    bindSubmitCmpt: async function (e) {
        let forms = e.detail;

        try {
            let opts = {
                title: '提交中'
            }
            let params = {
                activityId: this.data.id,
                forms
            }
            await cloudHelper.callCloudSumbit('activity/prepay', params, opts).then(res => {
                let content = (res.data.check == 0) ? '报名成功！' : '报名完成，请耐心等待系统审核';

                let activityJoinId = res.data.activityJoinId;

                if (!res.data.payRet) {
                    wx.showModal({
                        title: '温馨提示',
                        showCancel: false,
                        content: content,
                        async success(res) {
                            let parent = pageHelper.getPrevPage(2);
                            if (parent) await parent._loadDetail();
                            wx.navigateBack();
                        }
                    });
                }
                else {
                    const payment = res.data.payRet.payment;
                    wx.requestPayment({
                        ...payment,
                        success(result) {
                            wx.showModal({
                                title: '温馨提示',
                                showCancel: false,
                                content: content,
                                success(res) {
                                    wx.navigateBack();
                                }
                            });

                        },
                        fail(err) {
                            pageHelper.showModal('提交失败， 请重新提交~');
                            console.error('pay fail', err);
                        },
                        async complete() {
                            let parent = pageHelper.getPrevPage(2);
                            if (parent) parent._loadDetail();
                        }
                    })
                }

            })
        } catch (err) {
            console.log(err);
        };
    }

})