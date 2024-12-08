const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');

Page({
    data: {
        isLoad: false,
        card: null
    },

    onLoad: async function (options) {
        ProjectBiz.initPage(this);
        if (!options || !options.id) {
            pageHelper.showNoneToast('名片不存在');
            return;
        }

        await this._loadDetail(options.id);
    },

    _loadDetail: async function (id) {
        try {
            let opts = {
                title: 'bar'
            }
            let params = {
                id: id
            }
            let card = await cloudHelper.callCloudData('card/detail', params, opts);
            if (!card) {
                this.setData({
                    isLoad: null
                });
                return;
            }

            this.setData({
                isLoad: true,
                card
            });

        } catch (err) {
            console.error(err);
            this.setData({
                isLoad: null
            });
        }
    },

    onShareAppMessage: function () {
        return {
            title: this.data.card.USER_NAME + '的名片',
            path: pageHelper.fmtURLByPID('/pages/card/detail/card_detail?id=' + this.data.card.id)
        }
    },

    copyContact: function(e) {
        let content = e.currentTarget.dataset.content;
        wx.setClipboardData({
            data: content,
            success: function() {
                pageHelper.showSuccToast('已复制到剪贴板');
            }
        });
    }
});
