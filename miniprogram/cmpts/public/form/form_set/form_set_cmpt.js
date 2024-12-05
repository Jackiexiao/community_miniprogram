const pageHelper = require('../../../../helper/page_helper.js');
const dataHelper = require('../../../../helper/data_helper.js');

Component({
	options: {
		addGlobalClass: true
	},
	properties: {
		fields: {
			type: Array,
			value: [],
		},
	},
	data: {
		cur: -1,
	},
	lifetimes: {
		attached: function () {

		},

		ready: function () {


		},

		detached: function () {
		},
	},
	methods: {
		setGlow(cur) {
			this.setData({
				cur
			});
			setTimeout(() => {
				this.setData({
					cur: -1
				});
			}, 800);
		},

		url: function (e) {
			pageHelper.url(e, this);
		},

		set: function (fields) {
			this.setData({
				fields
			});
			this.triggerEvent('formset', fields);
		},

		get: function () {
			return this.data.fields;
		},

		bindEditTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let edit = pageHelper.dataset(e, 'edit'); 
			if (!edit) {
				return pageHelper.showNoneToast('该字段不可编辑和删除');
			}
			wx.navigateTo({
				url: '/cmpts/public/form/form_set/field/form_set_field?idx=' + idx,
			});
		},
		bindUpTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let fields = this.data.fields;
			dataHelper.arraySwap(fields, idx, idx - 1);
			this.setData({
				fields
			});
			this.setGlow(idx - 1);
			this.triggerEvent('formset', fields);
		},

		bindDownTap: function (e) {
			let idx = pageHelper.dataset(e, 'idx');
			let fields = this.data.fields;
			dataHelper.arraySwap(fields, idx, idx + 1);
			this.setData({
				fields
			});
			this.setGlow(idx + 1);
			this.triggerEvent('formset', fields);
		}
	}
})