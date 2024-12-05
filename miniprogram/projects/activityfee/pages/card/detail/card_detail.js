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
    }
});
