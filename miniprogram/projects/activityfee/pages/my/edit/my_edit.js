const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const contactConfig = require('../../../config/contact_config.js');

Page({
    data: {
        isLoad: false,
        isSubmitting: false,
        userId: '',
        formData: {
            name: '',
            realName: '',
            gender: '',
            genderText: '',
            userMobile: '',
            userPic: '',
            city: '',
            desc: '',
            profession: '',
            professionText: '',
            employmentStatus: '',
            statusText: '',
            resource: '',
            needs: '',
            contact: []
        },

        genderOptions: {
            unknown: '请选择性别',
            male: '男',
            female: '女',
            other: '其他'
        },
        professionOptions: {
            dev: '开发',
            product: '产品',
            design: '设计',
            operation: '运营',
            hardware: '硬件',
            sales: '销售',
            consulting: '咨询',
            maintenance: '运维',
            research: '研究',
            media: '媒体',
            investment: '投资',
            legal: '法务',
            teacher: '教师',
            student: '学生',
            art: '艺术',
            other: '其他'
        },
        statusOptions: {
            employed: '在职',
            startup: '创业',
            freelance: '自由',
            seeking: '求职',
            student: '在校'
        },

        contactCategories: contactConfig.CONTACT_CATEGORIES,
        defaultContactIcon: contactConfig.DEFAULT_ICON,
        
        showContactModal: false,
        currentContact: {
            category: '',
            content: '',
            customCategory: ''
        }
    },

    onLoad: function() {
        this._loadDetail();
    },

    _loadDetail: async function() {
        try {
            wx.showLoading({
                title: '加载中...',
                mask: true
            });

            let userId = PassportBiz.getUserId();
            if (!userId) {
                pageHelper.showModal('登录状态异常，请重新登录');
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
                return;
            }

            this.setData({ userId });

            let opts = {
                title: 'bar'
            }
            let user = await cloudHelper.callCloudData('passport/user_detail', {}, opts);
            
            if (!user) {
                this.setData({
                    isLoad: true,
                    formData: {
                        name: '',
                        realName: '',
                        gender: '',
                        genderText: '',
                        userMobile: '',
                        userPic: '',
                        city: '',
                        desc: '',
                        profession: '',
                        professionText: '',
                        employmentStatus: '',
                        statusText: '',
                        resource: '',
                        needs: '',
                        contact: []
                    }
                });
                return;
            }

            this.setData({
                isLoad: true,
                formData: {
                    name: user.USER_NICK_NAME || '',
                    realName: user.USER_REAL_NAME || '',
                    gender: user.USER_GENDER || '',
                    genderText: this.data.genderOptions[user.USER_GENDER] || '',
                    userMobile: user.USER_MOBILE || '',
                    userPic: user.USER_PIC || '',
                    city: user.USER_CITY || '',
                    desc: user.USER_DESC || '',
                    profession: user.USER_PROFESSION || '',
                    professionText: this.data.professionOptions[user.USER_PROFESSION] || '',
                    employmentStatus: user.USER_EMPLOYMENT_STATUS || '',
                    statusText: this.data.statusOptions[user.USER_EMPLOYMENT_STATUS] || '',
                    resource: user.USER_RESOURCE || '',
                    needs: user.USER_NEEDS || '',
                    contact: user.USER_CONTACT || []
                }
            });

        } catch (err) {
            console.error(err);
            pageHelper.showModal('加载失败，请重试');
        } finally {
            wx.hideLoading();
        }
    },

    bindGenderSelect(e) {
        if (this.data.isSubmitting) return;
        this.setData({
            'formData.gender': e.currentTarget.dataset.value,
            'formData.genderText': this.data.genderOptions[e.currentTarget.dataset.value]
        });
    },

    bindProfessionSelect(e) {
        if (this.data.isSubmitting) return;
        this.setData({
            'formData.profession': e.currentTarget.dataset.value,
            'formData.professionText': this.data.professionOptions[e.currentTarget.dataset.value]
        });
    },

    bindStatusSelect(e) {
        if (this.data.isSubmitting) return;
        const statusText = e.currentTarget.dataset.value;
        this.setData({
            'formData.employmentStatus': Object.keys(this.data.statusOptions).find(key => this.data.statusOptions[key] === statusText),
            'formData.statusText': statusText
        });
    },

    showAddContact() {
        this.setData({
            showContactModal: true,
            currentContact: {
                category: '',
                content: '',
                customCategory: ''
            }
        });
    },

    hideContactModal() {
        this.setData({
            showContactModal: false
        });
    },

    onContactInput(e) {
        const { field } = e.currentTarget.dataset;
        let value = e.detail.value;
        
        // 如果是点击预设类别
        if (field === 'category') {
            value = e.currentTarget.dataset.value;
            // 清空自定义类别
            this.setData({
                'currentContact.customCategory': ''
            });
        }
        
        this.setData({
            [`currentContact.${field}`]: value
        });
    },

    addContact() {
        const { currentContact, contactCategories } = this.data;
        
        // 验证输入
        if (!currentContact.category) {
            wx.showToast({
                title: '请选择类别',
                icon: 'none'
            });
            return;
        }
        
        if (currentContact.category === 'custom' && !currentContact.customCategory) {
            wx.showToast({
                title: '请输入自定义类别名称',
                icon: 'none'
            });
            return;
        }
        
        if (!currentContact.content) {
            wx.showToast({
                title: '请输入内容',
                icon: 'none'
            });
            return;
        }

        // 准备新的联系方式数据
        const newContact = {
            category: currentContact.category === 'custom' ? currentContact.customCategory : contactCategories[currentContact.category].title,
            content: currentContact.content,
            icon: currentContact.category === 'custom' ? this.data.defaultContactIcon : contactCategories[currentContact.category].icon
        };

        // 添加到联系方式列表
        const contacts = this.data.formData.contact || [];
        contacts.push(newContact);

        this.setData({
            'formData.contact': contacts,
            showContactModal: false,
            currentContact: {
                category: '',
                content: '',
                customCategory: ''
            }
        });
    },

    deleteContact(e) {
        const index = e.currentTarget.dataset.index;
        const contacts = this.data.formData.contact;
        contacts.splice(index, 1);
        this.setData({
            'formData.contact': contacts
        });
    },

    bindSubmitForm: async function() {
        if (this.data.isSubmitting) return;

        try {
            let data = this.data.formData;
            
            // 数据校验
            let checkRules = [
                { key: 'userMobile', message: '请填写手机号', pattern: /^1[3-9]\d{9}$/ },
                { key: 'realName', message: '请填写真实姓名', minLen: 2, maxLen: 20 },
                { key: 'city', message: '请填写城市', minLen: 2, maxLen: 20 },
                { key: 'desc', message: '请填写自我介绍', minLen: 10, maxLen: 500 }
            ];

            // 执行校验
            for (let rule of checkRules) {
                let value = data[rule.key];
                if (!value) {
                    pageHelper.showModal(rule.message);
                    return;
                }
                if (rule.minLen && value.length < rule.minLen) {
                    pageHelper.showModal(rule.message + '不能少于' + rule.minLen + '个字');
                    return;
                }
                if (rule.maxLen && value.length > rule.maxLen) {
                    pageHelper.showModal(rule.message + '不能超过' + rule.maxLen + '个字');
                    return;
                }
                if (rule.pattern && !rule.pattern.test(value)) {
                    pageHelper.showModal(rule.message + '格式不正确');
                    return;
                }
            }

            this.setData({ isSubmitting: true });

            let params = {
                userMobile: data.userMobile,
                realName: data.realName,
                gender: data.gender,
                city: data.city,
                desc: data.desc,
                resource: data.resource || '',
                needs: data.needs || '',
                profession: data.profession || '',
                employmentStatus: data.employmentStatus || '',
                contactList: data.contact || []
            };

            let opts = {
                title: '提交中'
            }

            let result = await cloudHelper.callCloudSumbit('passport/edit', params, opts);
            
            if (result && result.code === 200) {
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    duration: 1500,
                    mask: true,
                    complete: () => {
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 1500);
                    }
                });
            } else {
                throw new Error('修改个人资料返回数据异常');
            }
        } catch (err) {
            console.error('修改个人资料错误:', err);
            pageHelper.showModal(err.msg || '修改失败，请重试');
        } finally {
            this.setData({ isSubmitting: false });
        }
    }
});