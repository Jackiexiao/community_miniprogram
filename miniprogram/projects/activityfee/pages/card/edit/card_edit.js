const cloudHelper = require('../../../../../helper/cloud_helper.js');
const pageHelper = require('../../../../../helper/page_helper.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');
const validate = require('../../../../../helper/validate.js');

Page({
	data: {
		isLoad: false,
		id: null,

		roles: ['前端开发', '后端开发', '产品经理', '设计师', '全栈开发'],
		tags: [
			{ name: 'JavaScript', checked: false },
			{ name: 'Python', checked: false },
			{ name: 'Java', checked: false },
			{ name: 'Vue', checked: false },
			{ name: 'React', checked: false },
			{ name: 'Node.js', checked: false },
			{ name: 'Flutter', checked: false },
			{ name: 'UI设计', checked: false },
			{ name: '产品设计', checked: false },
			{ name: '用户研究', checked: false }
		],
		tagInput: '',

		formData: {
			USER_PIC: '',
			USER_NAME: '',
			USER_ROLE: '',
			USER_DESC: '',
			USER_TAGS: [],
			USER_PROJECTS: [],
			USER_MOBILE: '',
			USER_EMAIL: '',
			USER_WECHAT: ''
		}
	},

	onLoad: async function (options) {
		if (!pageHelper.getOptions(this, options)) return;
		if (!await PassportBiz.loginMustCancelWin(this)) return;

		if (this.data.id) {
			this._loadDetail();
		} else {
			this.setData({
				isLoad: true
			});
		}
	},

	_loadDetail: async function () {
		try {
			let params = {
				id: this.data.id
			}
			let opts = {
				title: 'bar'
			}
			let card = await cloudHelper.callCloudData('card/detail', params, opts);
			if (!card) return;

			// 设置标签选中状态
			let tags = this.data.tags;
			for (let tag of tags) {
				tag.checked = card.USER_TAGS.includes(tag.name);
			}

			this.setData({
				isLoad: true,
				formData: card,
				tags
			});

		} catch (err) {
			console.error(err);
		}
	},

	bindChooseImage: function () {
		wx.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album', 'camera'],
			success: async (res) => {
				let path = res.tempFilePaths[0];
				let opts = {
					title: '上传中'
				}
				try {
					let result = await cloudHelper.uploadImage(path, 'card/', opts);
					this.setData({
						'formData.USER_PIC': result
					});
				} catch (err) {
					console.error(err);
				}
			}
		})
	},

	bindRoleChange: function (e) {
		this.setData({
			'formData.USER_ROLE': this.data.roles[e.detail.value]
		});
	},

	bindTagTap: function (e) {
		let idx = e.currentTarget.dataset.idx;
		let tags = this.data.tags;
		let checkedCount = tags.filter(t => t.checked).length;

		if (!tags[idx].checked && checkedCount >= 5) {
			return pageHelper.showModal('最多只能选择5个标签');
		}

		tags[idx].checked = !tags[idx].checked;

		let userTags = tags.filter(t => t.checked).map(t => t.name);
		this.setData({
			tags,
			'formData.USER_TAGS': userTags
		});
	},

	bindTagInput: function (e) {
		this.setData({
			tagInput: e.detail.value
		});
	},

	bindTagAdd: function (e) {
		let tag = this.data.tagInput.trim();
		if (!tag) return;

		let tags = this.data.tags;
		let userTags = this.data.formData.USER_TAGS;

		if (userTags.length >= 5) {
			return pageHelper.showModal('最多只能添加5个标签');
		}

		if (!userTags.includes(tag)) {
			userTags.push(tag);
			this.setData({
				'formData.USER_TAGS': userTags,
				tagInput: ''
			});
		}
	},

	bindProjectAdd: function () {
		let projects = this.data.formData.USER_PROJECTS || [];
		projects.push({
			title: '',
			desc: '',
			tags: ''
		});
		this.setData({
			'formData.USER_PROJECTS': projects
		});
	},

	bindProjectDelete: function (e) {
		let idx = e.currentTarget.dataset.idx;
		let projects = this.data.formData.USER_PROJECTS;
		projects.splice(idx, 1);
		this.setData({
			'formData.USER_PROJECTS': projects
		});
	},

	bindFormSubmit: async function () {
		let data = this.data.formData;

		// 数据校验
		let rules = [
			{ key: 'USER_NAME', name: '昵称', required: true },
			{ key: 'USER_ROLE', name: '角色', required: true },
			{ key: 'USER_DESC', name: '简介', required: true },
			{ key: 'USER_TAGS', name: '技能标签', required: true },
		];

		let check = validate.check(data, rules);
		if (!check) return;

		let params = {
			id: this.data.id,
			...data
		}
		let opts = {
			title: '提交中'
		}

		try {
			await cloudHelper.callCloudData('card/edit', params, opts);
			let callback = () => {
				wx.navigateBack();
			}
			pageHelper.showSuccToast('提交成功', 1500, callback);
		} catch (err) {
			console.error(err);
		}
	}
})
