Component({
	externalClasses: ['outside-picker-multi-class'],
	properties: {
		sourceData: { //源数组 
			type: Array,
			value: [],
		},
		itemMulti: {
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {
				if (Array.isArray(newVal) && Array.isArray(oldVal) && JSON.stringify(newVal) != JSON.stringify(oldVal)) {
					console.log('checkbox observer');
					this._fixDefaultVal();
				}
			}
		},
		show: { // 排列模式 column/row
			type: String,
			value: 'column',
		},
		disabled: { // 是否禁用
			type: Boolean,
			value: false,
		},
	},
	lifetimes: {
		attached: function () { },

		ready: function () {
			this._fixDefaultVal();
		},

		detached: function () {
		},

	},
	data: {

	},
	methods: {
		bindChange: function (e) {
			this.triggerEvent('select', e.detail.value);
		},

		_fixDefaultVal() { //传入数据不匹配的时候，修正父页面传入的的数组默认值
			if (!Array.isArray(this.data.itemMulti)) {
				this.triggerEvent('select', []);
			}

			if (this.data.itemMulti.length == 0) return;

			let ret = [];
			let sourceData = this.data.sourceData;
			let itemMulti = this.data.itemMulti;
			for (let k = 0; k < sourceData.length; k++) {
				for (let j in itemMulti) {
					if (sourceData[k] == itemMulti[j])
						ret.push(itemMulti[j]);
				}
			}

			this.triggerEvent('select', ret);
		}
	}
})