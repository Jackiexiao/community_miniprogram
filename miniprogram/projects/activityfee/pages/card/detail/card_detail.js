const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const config = require('../../../config/config.js');

Page({
    data: {
        isLoad: false,
        id: null,
        card: null,
        isFav: false,
        professionMap: config.professionOptions,
        employmentStatusMap: config.statusOptions
    },

    onLoad: function (options) {
        ProjectBiz.initPage(this);
        if (!options || !options.id) {
            pageHelper.showNoneToast('名片不存在');
            return;
        }

        this.setData({
            id: options.id
        });
        this._loadDetail();
    },

    _loadDetail: async function () {
        if (!this.data.id) return;

        try {
            let opts = {
                title: 'bar'
            }
            let params = {
                id: this.data.id
            }
            console.log('[Card Detail] 请求参数:', params);
            let card = await cloudHelper.callCloudData('card/detail', params, opts);
            console.log('[Card Detail] 获取到的用户信息:', card);
            
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

            // 加载收藏状态
            await this._loadFavStatus();

        } catch (err) {
            console.error('[Card Detail] 加载详情失败:', err);
            this.setData({
                isLoad: null
            });
        }
    },

    _loadFavStatus: async function() {
        try {
            let params = {
                cardId: this.data.card.USER_ID  // 使用USER_ID作为cardId
            }
            let isFav = await cloudHelper.callCloudData('card/is_fav', params);
            console.log('[Card Detail] 获取到的收藏状态:', isFav);
            
            this.setData({
                isFav
            });
        } catch (err) {
            console.error('[Card Detail] 加载收藏状态失败:', err);
        }
    },

    onShareAppMessage: function () {
        return {
            title: this.data.card.USER_NICK_NAME + '的名片',
            path: '/pages/card/detail/card_detail?id=' + this.data.card.USER_ID  // 使用USER_ID作为分享链接的ID
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
    },

    bindFavTap: async function() {
        try {
            let params = {
                cardId: this.data.card.USER_ID  // 使用USER_ID作为cardId
            }
            if (this.data.isFav) {
                await cloudHelper.callCloudData('card/del_fav', params);
            } else {
                await cloudHelper.callCloudData('card/fav', params);
            }
            
            this.setData({
                isFav: !this.data.isFav
            });
            
            pageHelper.showNoneToast(this.data.isFav ? '收藏成功' : '取消收藏成功');
        } catch (err) {
            console.error('[Card Detail] 收藏操作失败:', err);
        }
    }
});
