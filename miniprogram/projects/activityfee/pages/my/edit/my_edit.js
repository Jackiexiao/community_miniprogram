const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const validate = require('../../../../../helper/validate.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({
    data: {
        isLoad: false,
        USER_PIC: '',
        formData: {
            name: '',
            realName: '',
            gender: 1,
            mobile: '',
            city: '',
            desc: '',
            resource: '',
            needs: '',
            pic: '',
            forms: []
        }
    },

    onLoad: async function (options) {
        ProjectBiz.initPage(this);
        await this._loadDetail();
    },

    _loadDetail: async function () {
        try {
            let opts = {
                title: 'bar'
            }
            let user = await cloudHelper.callCloudData('passport/my_detail', {}, opts);
            
            if (!user) {
                this.setData({
                    isLoad: null
                });
                return;
            }

            this.setData({
                isLoad: true,
                USER_PIC: user.USER_PIC,
                formData: {
                    name: user.USER_NAME || '',
                    realName: user.USER_REAL_NAME || '',
                    gender: user.USER_GENDER || 1,
                    mobile: user.USER_MOBILE || '',
                    city: user.USER_CITY || '',
                    desc: user.USER_DESC || '',
                    resource: user.USER_RESOURCE || '',
                    needs: user.USER_NEEDS || '',
                    pic: user.USER_PIC || '',
                    forms: user.USER_FORMS || []
                }
            });

        } catch (err) {
            this.setData({
                isLoad: null
            });
        }
    },

    onInput: function(e) {
        const field = e.currentTarget.dataset.field;
        const value = e.detail.value;
        this.setData({
            [`formData.${field}`]: value
        });
    },

    bindGenderChange: function(e) {
        const value = Number(e.detail.value);
        this.setData({
            'formData.gender': value
        });
    },

    bindFormSubmit: async function (e) {
        try {
            let data = this.data.formData;
            
            let validData = validate.check(data, {
                name: 'must|string|min:2|max:20|name=昵称',
                realName: 'must|string|min:2|max:20|name=姓名',
                gender: 'must|int|name=性别',
                mobile: 'must|mobile|name=手机号',
                city: 'string|max:100|name=城市',
                desc: 'string|min:10|max:500|name=个人简介',
                resource: 'string|max:500|name=可提供资源',
                needs: 'string|max:500|name=需求和期望'
            }, this);
            if (!validData) return;

            let opts = {
                title: '提交中'
            }
            
            if (!validData.name || validData.name.trim() === '') {
                pageHelper.showModal('昵称不能为空');
                return;
            }

            if (!validData.desc || validData.desc.trim().length < 10) {
                pageHelper.showModal('自我介绍不能少于10个字');
                return;
            }

            let params = {
                name: validData.name.trim(),
                realName: validData.realName.trim(),
                gender: validData.gender,
                mobile: validData.mobile.trim(),
                city: validData.city.trim(),
                desc: validData.desc.trim(),
                resource: validData.resource ? validData.resource.trim() : '',
                needs: validData.needs ? validData.needs.trim() : '',
                pic: this.data.formData.pic || this.data.USER_PIC || '',
                forms: this.data.formData.forms || []
            }
            
            let result = await cloudHelper.callCloudSumbit('passport/edit_base', params, opts);

            if (result && result.code === 200) {
                pageHelper.showSuccToast('修改成功', 1500);
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            }

        } catch (err) {
            pageHelper.showModal('修改失败: ' + (err.message || err));
        }
    },
});