const helper = require('../../../helper/helper.js');
const dataHelper = require('../../../helper/data_helper.js');
const pageHelper = require('../../../helper/page_helper.js');

Component({
	externalClasses: ['outside-picker-class'],

	options: {
		addGlobalClass: true, 
	},
	properties: {
		mark: {
			type: String,
			value: '',
		},
		isSlot: { //是否开启slot
			type: Boolean,
			value: false,
		},
		sourceData: { //源数组，sourceData有几维，Picker就可以有几阶 简单形式待选项,,,
			type: Array,
			value: [],
		},

		sourceDataStr: { //源数组，sourceData有几维，Picker就可以有几阶 简单形式待选项,,,
			type: String,
			value: '',
		},
		labelKey: {
			type: String,
			value: ''
		},
		steps: {
			type: Number,
			value: 1
		},

		noDataHint: { // 无数据的提示语
			type: String,
			value: '请选择',
		},
		index: {
			type: Number,
			value: 0
		},
		indexMulti: {
			type: Array,
			value: []
		},
		item: {
			type: String,
			value: '',
			observer: function (newVal, oldVal) {
				if (newVal != oldVal) {
					let options = this.data.options;
					if (!options || options.length == 0) this._init();
					if (options && options.length > 0) this.selected(newVal);
				}
			}
		},
		itemMulti: {
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {
				if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
					let options = this.data.options;
					if (!options || options.length == 0) this._init();
					if (options && options.length > 0) this.selected(newVal);
				}
			}
		},
		disabled: {
			type: Boolean,
			value: false,
		},

		disabledHint: { //  禁用提示
			type: String,
			value: '',
		},
	},
	data: {
		options: null,
		idx: 0,
		multiDesc: '', // 多选的显示文字
	},
	lifetimes: {
		attached: function () { },

		ready: function () {
			if (!this.data.options || this.data.options.length == 0) this._init();
		},

		detached: function () {
		},

	},
	methods: {
		_init: function () {
			let sourceData = this.data.sourceData;
			let labelKey = this.data.labelKey;
			let idx = this.data.idx;
			if (this.data.steps == 1 &&
				this.data.sourceDataStr &&
				(!sourceData || sourceData.length == 0)
			) {
				sourceData = dataHelper.getSelectOptions(this.data.sourceDataStr);
				this.setData({
					sourceData
				});
			}
			if (!sourceData || sourceData.length == 0) return;

			if (this.data.steps == 1) {
				if (sourceData.length > 0 && helper.isDefined(sourceData[0]['label'])) {
					labelKey = 'label';
				}
				idx = this.data.index;
			} else if (this.data.steps > 1) {
				if (sourceData.length > 0 && helper.isDefined(sourceData[0][0]['label'])) {
					labelKey = 'label';
				}
				idx = this.data.indexMulti;
			}

			this.setData({
				idx,
				labelKey,
				options: sourceData
			});
			this._getMultiDesc();

			if (this.data.steps == 1)
				this.selected(this.data.item);
			else
				this.selected(this.data.itemMulti);
		},

		_getMultiDesc: function () {
			let idx = this.data.idx;
			let options = this.data.options;
			if (idx.length != options.length) return;

			let multiDesc = [];
			if (this.data.labelKey) {
				for (let k = 0; k < options.length; k++) {
					multiDesc[k] = options[k][idx[k]].label;
				}
			} else {
				for (let k = 0; k < options.length; k++) {
					multiDesc[k] = options[k][idx[k]];
				}
			}
			this.setData({
				multiDesc
			});
		},

		bindTap: function (e) { // 点击行为
			if (this.data.disabled && this.data.disabledHint) {
				pageHelper.showModal(this.data.disabledHint, '提示', null, '知道了');
			}
		},
		bindChange: function (e) {
			let idx = e.detail.value;
			let val = null;

			if (this.data.steps == 1) {
				val = this.data.labelKey ? this.data.options[idx].val : this.data.options[idx];
				this.setData({
					item: val,
					index: idx
				});
			} else {
				val = [];
				let options = this.data.options;
				if (this.data.labelKey) {
					for (let k = 0; k < options.length; k++) {
						val[k] = options[k][idx[k]].val;
					}
				} else {
					for (let k = 0; k < options.length; k++) {
						val[k] = options[k][idx[k]];
					}
				}
				this._getMultiDesc();
			}

			this.triggerEvent('select', val);
		},
		getLabelOneStep: function (val) {
			for (let k = 0; k < this.data.sourceData.length; k++) {
				if (this.data.sourceData[k].val == val) return this.data.sourceData[k].label;
			}
			return 'unknown';
		},
		selected: function (val) {
			let options = this.data.options;
			let labelKey = this.data.labelKey;
			if (this.data.steps == 1) {
				for (let k = 0; k < options.length; k++) {
					if (labelKey && val == options[k].val) {
						this.setData({
							idx: k
						});
						return;
					} else if (!labelKey && val == options[k]) {

						this.setData({
							idx: k
						});
						return;
					}
				}
				this.setData({
					idx: -1
				});
				this.triggerEvent('select', '');

			} else if (this.data.steps > 1) {
				let idx = [];
				for (let k = 0; k < options.length; k++) {
					let levelTwo = options[k];
					for (let j in levelTwo) {
						if (labelKey && val[k] == options[k][j].val) {
							idx.push(j);
						} else if (!labelKey && val[k] == options[k][j]) {
							idx.push(j);
						}
					}
				}

				if (idx.length != options.length) idx = [];
				this.setData({
					idx
				});
				this._getMultiDesc();
			}


		}
	}
})