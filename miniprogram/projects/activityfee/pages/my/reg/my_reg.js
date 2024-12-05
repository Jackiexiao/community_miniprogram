const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const validate = require('../../../../../helper/validate.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const projectSetting = require('../../../public/project_setting.js');

Page({
	data: {
		isLoad: true,
		hasUserInfo: false,
		avatarUrl: '',
		nickName: '',
		phone: '',

		formRealName: '',
		formGender: 0,
		formCity: '',
		formDesc: '',
		formResource: '',
		formNeeds: '',

		genderOptions: ['未知', '男', '女'],
	},

	onLoad: function(options) {
		// 初始化表单数据
		this.setData({
			formRealName: '',
			formGender: 0,
			formCity: '',
			formDesc: '',
			formResource: '',
			formNeeds: ''
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
				phone: result.phone
			});
			
		} catch (err) {
			console.error(err);
			pageHelper.showModal('手机号码获取失败');
		}
	},

	bindGenderChange: function(e) {
		this.setData({
			formGender: Number(e.detail.value)
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
				{ key: 'formRealName', message: '请填写真实姓名' },
				{ key: 'formCity', message: '请填写城市' },
				{ key: 'formDesc', message: '请填写自我介绍' }
			];

			for (let rule of checkRules) {
				let value = data[rule.key];
				if (!value || value.length === 0) {
					console.log(`${rule.key} 的值为:`, value); // 调试日志
					return pageHelper.showModal(rule.message);
				}
			}

			// 提交数据
			let params = {
				mobile: data.phone,
				pic: data.avatarUrl,
				name: data.nickName,
				realName: data.formRealName,
				gender: data.formGender,
				city: data.formCity,
				desc: data.formDesc,
				resource: data.formResource || '',
				needs: data.formNeeds || '',
				status: projectSetting.USER_REG_CHECK ? 0 : 1,
				forms: []
			};

			console.log('提交到后端的数据:', params);

			let opts = {
				title: '提交中'
			}
			try {
				let result = await cloudHelper.callCloudSumbit('passport/register', params, opts);
				console.log('注册返回结果:', result);
				
				// 放宽条件判断，只要注册成功就进行跳转
				if (result && result.code === 200) {
					if (!projectSetting.USER_REG_CHECK) {
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
					}
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