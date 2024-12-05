const pageHelper = require('../../../helper/page_helper.js');

Component({
	externalClasses: ['outside-picker-multi-class'],

	options: {
		addGlobalClass: true, 
	},
	properties: {
		sourceData: { //源数组 
			type: Array,
			value: [],
		},
		sourceDataStr: { //源字符串 支持 x,y,z;;; 1=x,2=y,3=z 
			type: String,
			value: '',
		},
		itemSelected: {
			type: String,
			value: '',
		},
		show: { // 排列模式 column/row
			type: String,
			value: 'column',
		},
		labelExt: { // 附加描述
			type: String,
			value: '',
		},
		disabled: { // 是否禁用
			type: Boolean,
			value: false,
		},
	},
	lifetimes: {
		attached: function () { },

		ready: function () {
			let sourceDataStr = this.data.sourceDataStr;
			if (sourceDataStr) {
				let options = [];
				let arr = sourceDataStr.split(',');
				for (let k = 0; k < arr.length; k++) {
					let node = {};
					if (arr[k].includes('=')) {
						node.label = arr[k].split('=')[1];
						node.value = arr[k].split('=')[0];
					}
					else {
						node.label = arr[k];
						node.value = arr[k];
					}
					options.push(node);
				}
				this.setData({
					options
				});
			}
			else {
				let sourceData = this.data.sourceData;
				let options = [];
				for (let k = 0; k < sourceData.length; k++) {
					let node = {
						label: sourceData[k],
						value: sourceData[k]
					};
					options.push(node);
				}
				this.setData({
					options 
				});
			}

		},

		detached: function () {
		},

	},
	data: {
		options: []
	},
	methods: {
		bindChange: function (e) { 
			this.triggerEvent('select', e.detail.value);
		},

		bindTagChange: function (e) {
			let itemSelected = pageHelper.dataset(e, 'val');
			this.setData({
				itemSelected
			});
			this.triggerEvent('select', itemSelected);
		},
	}
})