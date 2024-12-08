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
		hasUserInfo: false,
		userPic: '',
		nickName: '',
		userMobile: '',

		formData: {
			gender: 'unknown',
			realName: '',
			userMobile: '',
			city: '',
			profession: '',
			employmentStatus: '',
			desc: '',
			resource: '',
			needs: '',
			contact: []
		},

		genderOptions: {
            unknown: '未知',
            male: '男',
            female: '女'
        },
        professionOptions: {
			'dev': '开发',
			'product': '产品',
			'design': '设计',
			'operation': '运营',
			'hardware': '硬件',
			'sales': '销售',
			'consulting': '咨询',
			'maintenance': '运维',
			'research': '研究',
			'media': '媒体',
			'investment': '投资',
			'legal': '法务',
			'teacher': '教师',
			'student': '学生',
			'art': '艺术',
			'other': '其他'
		},
        statusOptions: {
			'employed': '在职',
			'startup': '创业',
			'freelance': '自由',
			'seeking': '求职',
			'student': '在校'
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

	onLoad: function(options) {
		this.setData({
			formData: {
				gender: 'unknown',
				realName: '',
				userMobile: '',
				city: '',
				profession: '',
				employmentStatus: '',
				desc: '',
				resource: '',
				needs: '',
				contact: []
			}
		});
	},

	bindChooseAvatar: async function(e) {
		try {
			if (!e.detail.avatarUrl) {
				pageHelper.showModal('未获取到头像');
				return;
			}

			const fs = wx.getFileSystemManager();
			const fileInfo = await new Promise((resolve, reject) => {
				fs.getFileInfo({
					filePath: e.detail.avatarUrl,
					success: resolve,
					fail: reject
				});
			});

			if (fileInfo.size > 2 * 1024 * 1024) { 
				pageHelper.showModal('头像文件过大，请选择2MB以下的图片');
				return;
			}

			this.setData({
				hasUserInfo: true,
				userPic: e.detail.avatarUrl
			});
		} catch (err) {
			console.error('头像选择错误:', err);
			pageHelper.showModal('头像选择失败，请重试');
		}
	},

	bindGetPhoneNumber: async function(e) {
		if (this.data.isSubmitting) return;
		
		try {
			let result = await PassportBiz.getPhone(e);
			if (!result || !result.phone) {
				pageHelper.showModal('手机号码获取失败，请重试');
				return;
			}

			if (!/^1[3-9]\d{9}$/.test(result.phone)) {
				pageHelper.showModal('手机号码格式不正确');
				return;
			}
			
			this.setData({
				userMobile: result.phone,
				'formData.userMobile': result.phone
			});
			
		} catch (err) {
			console.error('获取手机号错误:', err);
			pageHelper.showModal('手机号码获取失败，请重试');
		}
	},

	bindGenderSelect(e) {
		if (this.data.isSubmitting) return;
		const genderValue = e.currentTarget.dataset.value;
		const genderMap = {
			'1': 'male',
			'2': 'female',
			'3': 'other'
		};
		this.setData({
			'formData.gender': genderMap[genderValue] || 'unknown'
		});
	},

	bindProfessionSelect(e) {
		if (this.data.isSubmitting) return;
		const professionKey = e.currentTarget.dataset.value;
		this.setData({
			'formData.profession': professionKey
		});
	},

	bindStatusSelect(e) {
		if (this.data.isSubmitting) return;
		const statusKey = e.currentTarget.dataset.value;
		this.setData({
			'formData.employmentStatus': statusKey
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
		
		if (field === 'category') {
			value = e.currentTarget.dataset.value;
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

		const newContact = {
			category: currentContact.category === 'custom' ? currentContact.customCategory : contactCategories[currentContact.category].title,
			content: currentContact.content,
			icon: currentContact.category === 'custom' ? this.data.defaultContactIcon : contactCategories[currentContact.category].icon
		};

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
		if (field === 'nickName') {
			this.setData({
				[field]: value
			});
		} else {
			this.setData({
				[`formData.${field}`]: value
			});
		}
	},

	bindSubmitForm: async function(e) {
		try {
			let data = this.data;
			if (data.isSubmitting) return;

			// 数据校验 
			let mobile = data.formData.userMobile;
			if (mobile.length < 11)
				return pageHelper.showModal('请填写正确的手机号码');
			
			let checkRules = [
				{ key: 'userPic', message: '请选择头像' },
				{ key: 'nickName', message: '请填写昵称', minLen: 2, maxLen: 20 },
				{ key: 'formData.userMobile', message: '请填写手机号', pattern: /^1[3-9]\d{9}$/ },
				{ key: 'formData.gender', message: '请选择性别' },
				{ key: 'formData.realName', message: '请填写真实姓名', minLen: 2, maxLen: 20 },
				{ key: 'formData.city', message: '请填写城市', minLen: 2, maxLen: 20 },
				{ key: 'formData.desc', message: '请填写自我介绍', minLen: 10, maxLen: 500 }
			];

			for (let rule of checkRules) {
				let value;
				if (rule.key.includes('.')) {
					// 处理嵌套对象
					value = rule.key.split('.').reduce((obj, key) => obj && obj[key], data);
				} else {
					value = data[rule.key];
				}
				
				if (!value || value.length === 0) {
					pageHelper.showModal(rule.message);
					this.setData({ isSubmitting: false });
					return;
				}

				if (rule.pattern && !rule.pattern.test(value)) {
					pageHelper.showModal('请输入正确的' + rule.message.replace('请填写', ''));
					this.setData({ isSubmitting: false });
					return;
				}

				if (rule.minLen && value.length < rule.minLen) {
					pageHelper.showModal(rule.message.replace('请填写', '') + `长度不能少于${rule.minLen}个字符`);
					this.setData({ isSubmitting: false });
					return;
				}

				if (rule.maxLen && value.length > rule.maxLen) {
					pageHelper.showModal(rule.message.replace('请填写', '') + `长度不能超过${rule.maxLen}个字符`);
					this.setData({ isSubmitting: false });
					return;
				}
			}

			// 获取英文值（反向映射）
			const professionCn = data.formData.profession || '';
			const employmentStatusCn = data.formData.employmentStatus || '';

			// 反向映射函数：从中文找到对应的英文key
			const getKeyByValue = (obj, value) => {
				return Object.keys(obj).find(key => obj[key] === value);
			};

			// 转换为英文值
			const professionEn = getKeyByValue(this.data.professionOptions, professionCn) || 'other';
			const employmentStatusEn = getKeyByValue(this.data.statusOptions, employmentStatusCn) || 'employed';

			// 打印详细日志
			console.log('[Register Debug] 原始职业值(中文):', professionCn);
			console.log('[Register Debug] 转换后职业值(英文):', professionEn);
			console.log('[Register Debug] 职业映射:', this.data.professionOptions);
			console.log('[Register Debug] 原始就业状态(中文):', employmentStatusCn);
			console.log('[Register Debug] 转换后就业状态(英文):', employmentStatusEn);
			console.log('[Register Debug] 就业状态映射:', this.data.statusOptions);

			let params = {
				userMobile: data.formData.userMobile,
				userPic: data.userPic,
				nickName: data.nickName,
				realName: data.formData.realName,
				gender: data.formData.gender,
				city: data.formData.city,
				desc: data.formData.desc,
				resource: data.formData.resource || '',
				needs: data.formData.needs || '',
				profession: professionEn,  // 使用转换后的英文值
				employmentStatus: employmentStatusEn,  // 使用转换后的英文值
				contactList: data.formData.contact || [],
				forms: [],
				status: 1
			};

			let opts = {
				title: '提交中'
			}

			try {
				console.log('[Register Params] 完整参数:', JSON.stringify(params, null, 2)); 
				let result = await cloudHelper.callCloudSumbit('passport/register', params, opts);
			
				if (result && result.code === 200) {
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
					throw new Error('注册返回数据异常');
				}
			} catch (err) {
				console.error('注册错误:', err);
				pageHelper.showModal(err.msg || '注册失败，请重试');
			} finally {
				this.setData({ isSubmitting: false });
			}
		} catch (err) {
			console.error('注册错误:', err);
			pageHelper.showModal(err.msg || '注册失败，请重试');
		} finally {
			this.setData({ isSubmitting: false });
		}
	}
})