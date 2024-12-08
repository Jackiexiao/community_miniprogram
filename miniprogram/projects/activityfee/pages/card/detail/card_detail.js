const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');

Page({
    data: {
        isLoad: false,
        id: null,
        card: null,
        isFav: false,

        professionMap: {
            'dev': '开发',
            'product': '产品',
            'design': '设计',
            'operation': '运营',
            'hardware': '硬件',
            'sales': '销售',
            'consulting': '咨询',
            'maintenance': '维护',
            'research': '研究',
            'media': '媒体',
            'investment': '投资',
            'legal': '法务',
            'teacher': '教师',
            'student': '学生',
            'art': '艺术',
            'other': '其他'
        },

        employmentStatusMap: {
            'employed': '已就业',
            'startup': '创业中',
            'freelance': '自由职业',
            'seeking': '求职中',
            'student': '学生'
        }
    },

    onLoad: async function (options) {
        ProjectBiz.initPage(this);
        if (!options || !options.id) {
            pageHelper.showNoneToast('名片不存在');
            return;
        }

        this.setData({
            id: options.id
        });
        await this._loadDetail();
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

            // 检查是否已收藏
            this._loadFavStatus();

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
                id: this.data.id
            }
            let res = await cloudHelper.callCloudData('card/fav_status', params);
            console.log('[Card Detail] 获取到的收藏状态:', res);
            
            if (res) {
                this.setData({
                    isFav: true
                });
            }
        } catch (err) {
            console.error('[Card Detail] 加载收藏状态失败:', err);
        }
    },

    onShareAppMessage: function () {
        return {
            title: this.data.card.USER_NAME + '的名片',
            path: '/pages/card/detail/card_detail?id=' + this.data.id
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
                id: this.data.id
            }
            await cloudHelper.callCloudData('card/fav', params);
            
            this.setData({
                isFav: !this.data.isFav
            });
            
            pageHelper.showNoneToast(this.data.isFav ? '收藏成功' : '取消收藏成功');
        } catch (err) {
            console.error('[Card Detail] 收藏操作失败:', err);
        }
    }
});
