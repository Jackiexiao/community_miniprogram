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
		_userId: '',

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
        professionOptionsList: [
			{ key: 'dev', value: '开发' },
			{ key: 'product', value: '产品' },
			{ key: 'design', value: '设计' },
			{ key: 'operation', value: '运营' },
			{ key: 'hardware', value: '硬件' },
			{ key: 'sales', value: '销售' },
			{ key: 'consulting', value: '咨询' },
			{ key: 'maintenance', value: '运维' },
			{ key: 'research', value: '研究' },
			{ key: 'media', value: '媒体' },
			{ key: 'investment', value: '投资' },
			{ key: 'legal', value: '法务' },
			{ key: 'teacher', value: '教师' },
			{ key: 'student', value: '学生' },
			{ key: 'art', value: '艺术' },
			{ key: 'other', value: '其他' }
		],
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

	async onLoad(options) {
		try {
			// 获取用户ID
			let userId = PassportBiz.getUserId();
			console.log('[My Edit] 获取到的用户ID:', userId);
			
			if (!userId) {
				pageHelper.showModal('用户未登录');
				return;
			}

			this.setData({
				_userId: userId
			});

			let opts = {
				title: '加载中'
			}
			
			console.log('[My Edit] 开始调用user_detail接口，参数:', { userId });
			let params = {
				userId
			};
			let user = await cloudHelper.callCloudData('passport/user_detail', params, opts);
			console.log('[My Edit] user_detail接口返回数据:', user);
			
			if (!user) {
				pageHelper.showModal('获取用户信息失败');
				return;
			}

			// 打印详细的用户信息
			console.log('[My Edit] 用户基本信息:', {
				USER_PIC: user.USER_PIC,
				USER_NAME: user.USER_NAME,
				USER_MOBILE: user.USER_MOBILE,
				USER_GENDER: user.USER_GENDER,
				USER_REAL_NAME: user.USER_REAL_NAME,
				USER_CITY: user.USER_CITY,
				USER_PROFESSION: user.USER_PROFESSION,
				USER_EMPLOYMENT_STATUS: user.USER_EMPLOYMENT_STATUS,
				USER_NICK_NAME: user.USER_NICK_NAME
			});

			// 设置用户基本信息
			let formData = {
				gender: user.USER_GENDER || 'unknown',
				realName: user.USER_REAL_NAME || '',
				userMobile: user.USER_MOBILE || '',
				city: user.USER_CITY || '',
				profession: user.USER_PROFESSION || '',  // 这里已经是英文代码
				employmentStatus: user.USER_EMPLOYMENT_STATUS || '',
				desc: user.USER_DESC || '',
				resource: user.USER_RESOURCE || '',
				needs: user.USER_NEEDS || '',
				contact: user.USER_CONTACT_LIST || [],
				nickName: user.USER_NICK_NAME || ''
			};
			
			console.log('[My Edit] 设置到页面的formData:', formData);

			this.setData({
				isLoad: true,
				hasUserInfo: true,
				userPic: user.USER_PIC,
				nickName: user.USER_NICK_NAME || '',
				userMobile: user.USER_MOBILE || '',
				formData
			});

		} catch (err) {
			console.error('[My Edit] 获取用户信息失败:', err);
			pageHelper.showModal('获取用户信息失败');
		}
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

			// 上传到云存储
			let cloudPath = 'avatar/' + this._userId + '/' + new Date().getTime() + '.jpg';
			let opts = {
				title: '上传中'
			};
			try {
				let res = await cloudHelper.transTempPicOne(e.detail.avatarUrl, cloudPath, opts);
				console.log('[Upload Avatar] 上传结果:', res);
				
				if (!res || !res.fileID) {
					pageHelper.showModal('头像上传失败，请重试');
					return;
				}

				this.setData({
					hasUserInfo: true,
					userPic: res.fileID
				});
			} catch (err) {
				console.error('[Upload Avatar] 上传失败:', err);
				pageHelper.showModal('头像上传失败，请重试');
			}
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
		console.log('[My Edit] 选择职业:', professionKey, this._getProfessionName(professionKey));
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

	_getProfessionCode(chineseProfession) {
		for (let key in this.data.professionOptions) {
			if (this.data.professionOptions[key] === chineseProfession) {
				return key;
			}
		}
		return '';
	},

	_getProfessionName(code) {
		return this.data.professionOptions[code] || '';
	},

	async bindSubmitForm(e) {
		try {
			if (!this.data.userPic) {
				pageHelper.showModal('请上传头像');
				return;
			}

			if (!this.data.userMobile) {
				pageHelper.showModal('请填写手机号码');
				return;
			}

			let data = {
				nickName: this.data.formData.nickName || this.data.nickName,
				realName: this.data.formData.realName,
				userMobile: this.data.formData.userMobile,
				userPic: this.data.userPic,
				gender: this.data.formData.gender,
				profession: this.data.formData.profession,
				city: this.data.formData.city,
				desc: this.data.formData.desc,
				employmentStatus: this.data.formData.employmentStatus,
				resource: '',
				needs: '',
				contactList: [],
				forms: []
			};
			
			// 数据校验
			let rules = {
				nickName: 'must|string|min:1|max:30|name=昵称',
				realName: 'must|string|min:2|max:30|name=真实姓名',
				userMobile: 'must|mobile|name=手机',
				userPic: 'must|string|name=头像',
				gender: 'must|string|in:unknown,male,female,other|name=性别',
				profession: 'must|string|in:dev,product,design,operation,hardware,sales,consulting,maintenance,research,media,investment,legal,teacher,student,art,other|name=职业领域',
				city: 'must|string|min:2|max:50|name=城市',
				desc: 'must|string|min:10|max:500|name=自我介绍',
				employmentStatus: 'must|string|in:employed,startup,freelance,seeking,student|name=就业状态',
			};

			console.log('[My Edit] 提交前的数据:', data);

			// 校验
			data = validate.check(data, rules, this);
			if (!data) return;

			// 确保profession是英文代码
			if (data.profession && !this.data.professionOptions[data.profession]) {
				data.profession = this._getProfessionCode(data.profession);
			}

			console.log('[My Edit] 最终提交的数据:', data);

			let opts = {
				title: '提交中'
			}
			try {
				await cloudHelper.callCloudSumbit('passport/edit_base', data, opts).then(res => {
					let callback = () => {
						wx.navigateBack();
					}
					pageHelper.showSuccToast('修改成功', 1500, callback);
				});
			} catch (err) {
				console.error('[My Edit] 提交表单失败:', err);
				pageHelper.showModal('提交失败：' + (err.message || '未知错误'));
			}
		} catch (err) {
			console.error('[My Edit] 表单处理错误:', err);
			pageHelper.showModal('表单提交错误，请重试');
		}
	}
})