const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const ActivityBiz = require('../../../biz/activity_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
    data: {
        isLogin: true
    },
    onLoad: function (options) {
        ProjectBiz.initPage(this);

        this._getSearchMenu();
    },
    onReady: function () {

    },
    onShow: function () {

    },
    onHide: function () {

    },
    onUnload: function () {

    },
    onPullDownRefresh: function () {

    },
    onReachBottom: function () {

    },
    onShareAppMessage: function () {

    },

    url: async function (e) {
        pageHelper.url(e, this);
    },

    bindCommListCmpt: function (e) {
        pageHelper.commListListener(this, e);
    },
    _getSearchMenu: function () {
        let sortItem1 = [
            { label: '排序', type: '', value: '' },
            { label: '按时间倒序', type: 'timedesc', value: '' },
            { label: '按时间正序', type: 'timeasc', value: '' }];

        let sortItems = [sortItem1];
        let sortMenus = [
            { label: '全部', type: '', value: '' },
            { label: '待审核', type: 'wait', value: '' },
            { label: '报名成功', type: 'succ', value: '' },
            { label: '用户取消', type: 'usercancel', value: '' },
            { label: '未过审/系统取消', type: 'cancel', value: '' }
        ]

        this.setData({
            search: '',
            sortItems,
            sortMenus,
            isLoad: true
        });

    },
    bindCancelTap: async function (e) {
        if (!await PassportBiz.loginMustCancelWin(this)) return;

        let activityJoinId = pageHelper.dataset(e, 'id');

        let callback = () => {
            let node = {
                'ACTIVITY_JOIN_STATUS': 98, 
            }
            pageHelper.modifyPrevPageListNodeObject(activityJoinId, node, 1);
        }
        await ActivityBiz.cancelMyActivityJoin(activityJoinId, callback);
    }
})