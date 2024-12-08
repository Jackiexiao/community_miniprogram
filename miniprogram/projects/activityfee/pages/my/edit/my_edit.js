const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const contactConfig = require('../../../config/contact_config.js');

Page({
    data: {
        isLoad: false,
        formData: {
            name: '',
            realName: '',
            gender: '',
            mobile: '',
            city: '',
            desc: '',
            profession: '',
            status: '',
            contact: []
        },

        genderOptions: ['请选择性别', '男', '女', '其他'],
        professionOptions: ['开发', '产品', '设计', '运营', '硬件', '销售', '咨询', '运维', '研究', '媒体', '投资', '法务', '教师', '学生', '艺术', '其他'],
        statusOptions: ['在职', '创业', '自由', '求职', '在校'],

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
            let opts = {
                title: 'bar'
            }
            let user = await cloudHelper.callCloudData('passport/user_detail', {}, opts);
            if (!user) {
                this.setData({
                    isLoad: true
                });
                return;
            }

            this.setData({
                isLoad: true,
                formData: {
                    name: user.USER_NAME || '',
                    realName: user.USER_REAL_NAME || '',
                    gender: user.USER_GENDER || '',
                    mobile: user.USER_MOBILE || '',
                    city: user.USER_CITY || '',
                    desc: user.USER_DESC || '',
                    resource: user.USER_RESOURCE || '',
                    needs: user.USER_NEEDS || '',
                    profession: user.USER_PROFESSION || '',
                    status: user.USER_STATUS || '',
                    contact: user.USER_CONTACT || []
                }
            });

        } catch (err) {
            console.error(err);
        }
    },

    bindGenderSelect(e) {
        this.setData({
            'formData.gender': Number(e.currentTarget.dataset.value)
        });
    },

    bindProfessionSelect(e) {
        this.setData({
            'formData.profession': e.currentTarget.dataset.value
        });
    },

    bindStatusSelect(e) {
        this.setData({
            'formData.status': e.currentTarget.dataset.value
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
        try {
            let data = this.data.formData;

            // 数据校验
            let rules = {
                name: 'required|string|min:2|max:20|name=昵称',
                realName: 'required|string|min:2|max:20|name=姓名',
                gender: 'required|int|in:1,2,3|name=性别',
                mobile: 'required|mobile|name=手机',
                city: 'required|string|min:2|max:100|name=城市',
                desc: 'required|string|min:10|max:500|name=个人简介',
                profession: 'required|string|min:2|max:20|name=职业',
                status: 'required|string|min:2|max:20|name=状态',
                contact: 'array|name=联系方式'
            };

            // 取得数据
            data = validate.check(data, rules);
            if (!data) return;

            let opts = {
                title: '提交中'
            }
            await cloudHelper.callCloudSumbit('passport/edit_base', data, opts).then(res => {
                if (res.data.ret == 0) {
                    wx.navigateBack();
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
});