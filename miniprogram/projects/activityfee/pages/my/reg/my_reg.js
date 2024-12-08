const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const projectSetting = require('../../../public/project_setting.js');
const contactConfig = require('../../../config/contact_config.js');

Page({
	data: {
		isLoad: true,
		hasUserInfo: false,
		avatarUrl: '',
		nickName: '',
		phone: '',

		formData: {
			gender: '',
			name: '',
			realName: '',
			mobile: '',
			city: '',
			profession: '',
			status: '',
			statusText: '', 
			desc: '',
			resource: '',
			needs: '',
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

	onLoad: function(options) {
		// 初始化表单数据
		this.setData({
			formData: {
				gender: '',
				name: '',
				realName: '',
				mobile: '',
				city: '',
				profession: '',
				status: '',
				statusText: '', 
				desc: '',
				resource: '',
				needs: '',
				contact: []
			}
		});
	},

	bindChooseAvatar: async function(e) {
		try {
			if (e.detail.avatarUrl) {
				this.setData({
					hasUserInfo: true,
					avatarUrl: e.detail.avatarUrl
				});
			} else {
				pageHelper.showModal('未获取到头像');
			}
		} catch (err) {
			console.error(err);
		}
	},

	bindGetPhoneNumber: async function(e) {
		try {
			let result = await PassportBiz.getPhone(e);
			console.log('获取手机号返回结果:', result);
			
			if (!result) return;
			
			this.setData({
				phone: result.phone,
				'formData.mobile': result.phone
			});
			
		} catch (err) {
			console.error(err);
			pageHelper.showModal('手机号码获取失败');
		}
	},

	bindGenderSelect(e) {
		// 将性别值映射为后端需要的格式 (0,1,2)
		const genderMap = {
			'1': 1, // 男
			'2': 2, // 女
			'3': 0  // 其他
		};
		const genderValue = e.currentTarget.dataset.value;
		this.setData({
			'formData.gender': genderMap[genderValue] || 0
		});
	},

	bindProfessionSelect(e) {
		this.setData({
			'formData.profession': e.currentTarget.dataset.value
		});
	},

	bindStatusSelect(e) {
		// 将状态值转换为数字类型
		// 在职=1, 创业=2, 自由=3, 求职=4, 在校=5
		const statusMap = {
			'在职': 1,
			'创业': 2,
			'自由': 3,
			'求职': 4,
			'在校': 5
		};
		const statusText = e.currentTarget.dataset.value;
		this.setData({
			'formData.status': statusMap[statusText] || 1, // 默认为在职
			'formData.statusText': statusText // 保存状态文本
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
		let contactList = this.data.formData.contact;
		contactList.splice(index, 1);
		this.setData({
			'formData.contact': contactList
		});
	},

	onInput: function(e) {
		const field = e.currentTarget.dataset.field;
		const value = e.detail.value;
		console.log('输入字段:', field, '值:', value);
		this.setData({
			[`formData.${field}`]: value
		});
	},

	bindSubmitForm: async function(e) {
		try {
			let data = this.data;
			console.log('提交的表单数据:', data);

			// 数据校验
			let checkRules = [
				{ key: 'avatarUrl', message: '请选择头像' },
				{ key: 'nickName', message: '请填写昵称' },
				{ key: 'phone', message: '请填写手机号' },
				{ key: ['formData', 'gender'], message: '请选择性别' },
				{ key: ['formData', 'realName'], message: '请填写真实姓名' },
				{ key: ['formData', 'city'], message: '请填写城市' },
				{ key: ['formData', 'desc'], message: '请填写自我介绍' }
			];

			for (let rule of checkRules) {
				let value;
				if (Array.isArray(rule.key)) {
					// 处理嵌套对象
					value = rule.key.reduce((obj, key) => obj && obj[key], data);
				} else {
					// 处理顶层属性
					value = data[rule.key];
				}
				
				console.log(`检查字段 ${Array.isArray(rule.key) ? rule.key.join('.') : rule.key} 的值:`, value);
				
				if (!value || value.length === 0) {
					return pageHelper.showModal(rule.message);
				}
			}

			// 提交数据
			let params = {
				mobile: data.phone,
				pic: data.avatarUrl,
				name: data.nickName,
				realName: data.formData.realName,
				gender: data.formData.gender,
				city: data.formData.city,
				desc: data.formData.desc,
				resource: data.formData.resource || '',
				needs: data.formData.needs || '',
				profession: data.formData.profession || '',
				status: data.formData.status || '',
				statusText: data.formData.statusText || '', 
				contactList: data.formData.contact || [],
				forms: []
			};

			console.log('提交到后端的数据:', params);

			let opts = {
				title: '提交中'
			}
			try {
				let result = await cloudHelper.callCloudSumbit('passport/register', params, opts);
				console.log('注册返回结果:', result);
				
				if (result && result.code === 200) {
					// 如果有token就设置
					if (result.data && result.data.token) {
						PassportBiz.setToken(result.data.token);
					}
					
					wx.showToast({
						title: '注册成功',
						icon: 'success',
						duration: 1500,
						mask: true,
						complete: () => {
							setTimeout(() => {
								wx.switchTab({
									url: '/projects/activityfee/pages/my/index/my_index'
								});
							}, 1500);
						}
					});
				} else {
					console.log('注册成功但返回数据异常:', result);
					pageHelper.showModal('注册异常，请重试');
				}
			} catch (err) {
				console.log('注册失败:', err);
				if (err.msg) {
					pageHelper.showModal(err.msg);
				} else {
					pageHelper.showModal('注册失败，请重试');
				}
			}
		} catch (err) {
			console.error(err);
			pageHelper.showModal('系统错误，请重试');
		}
	}
}) 