/* 参考文档: https://github.com/IceApriler/miniprogram-picker */
/*
[{
	label:'ddd' // 展示数据的字段名称
	val:'v1',
},
{
	label:'cccc',
	val:'v2'
}]
*/
const dataHelper = require('../../../helper/data_helper.js');

function isExist(field) {
	return field !== null && field !== undefined
}

Component({
	externalClasses: ['outside-picker-multi-class'],
	properties: {
		mode: { // minute
			type: String,
			value: ''
		},
		timeModeStep: {
			type: Number,
			value: 1
		},
		autoSelect: {
			type: Boolean,
			value: false
		},
		sourceData: {
			type: Array,
			value: [],
			observer: 'sourceDataChange'
		},
		steps: {
			type: Number,
			value: 1
		},
		initColumnSelectedIndex: {
			type: Boolean,
			value: false,
		},
		itemIndex: {
			type: Array,
			value: []
		},
		itemMulti: {
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {  
				if (JSON.stringify(newVal) != JSON.stringify(oldVal)) { 
					this.sourceDataChange(this.data.sourceData);
				}
			}
		},
		disabled: {
			type: Boolean,
			value: false,
		},
		isSlot: { //是否开启slot
			type: Boolean,
			value: true,
		},
	},
	data: {
		multiIndex: {
			type: Array,
			value: [],
		},
		multiArray: {
			type: Array,
			value: [],
		},
		selectedArray: {
			type: Array,
			value: [],
		},

	},
	lifetimes: {
		created: function () {},
		attached: function () {

			if (this.data.autoSelect) {
				this.processData();
			}
		},

		ready: function () {

		},

		detached: function () {
		},
	},

	pageLifetimes: {
		show: function () {

		},
		hide: function () {
		},
		resize: function (size) {
		}
	},
	methods: {
		sourceDataChange: function (newSourceData) {
			const {
				steps
			} = this.data;
			const multiIndex = [];
			const multiArray = [];
			newSourceData = this.checkSourceData(newSourceData);
			const itemIndex = this.getDefaultIndex(newSourceData);
			const handle = (source = [], columnIndex = 0) => {
				const _multiArrayColumn0 = [];

				source.forEach((item, index) => {
					if (columnIndex === 0) {
						_multiArrayColumn0.push(item.label)
					}

					if (isExist(item.label) && index === (itemIndex[columnIndex] || 0)) {
						multiIndex.push(index);

						if (columnIndex < steps - 1) {
							if (isExist(item.children)) {
								const _subsetArr = item.children.map(sub => sub.label);
								multiArray.push(_subsetArr);
								handle(item.children, columnIndex + 1);
							}
						}
					}
				})

				if (columnIndex === 0) {
					multiArray.unshift(_multiArrayColumn0);
				}
			}

			handle(newSourceData);

			this.setData({
				multiIndex,
				multiArray
			})

			if (this.data.autoSelect) {
				this.processData();
			} 
 
		},
		getDefaultIndex: function (newSourceData) {
			const {
				itemIndex,
				itemMulti,
				steps,
			} = this.data;
			if (itemIndex.length) {
				return itemIndex; // 返回默认选中的下标数据
			} else if (itemMulti.length) {
				if (itemMulti.length !== steps) {
					this.consoleError(new Error('你设置的"itemMulti"字段阶数与"steps"不符，请修改后再试。'));
					return [];
				} else {
					const _defaultIndex = [];
					const handle = (source = [], columnIndex = 0) => {
						_defaultIndex[columnIndex] = 0;
						source.forEach((item, index) => {
							if (
								(itemMulti[columnIndex]) ===
								(item.val)
							) {
								_defaultIndex[columnIndex] = index;

								if (columnIndex < steps - 1) {
									if (item.children) {
										handle(item.children, columnIndex + 1);
									}
								}
							}
						})
					}
					handle(newSourceData);
					return _defaultIndex;
				}
			} else {
				return [];
			}
		},
		checkSourceData: function (sourceData) {
			const {
				steps
			} = this.data;
			const handle = (source = [], columnIndex = 0) => {
				if (!source.length) {
					const temp = {};
					temp.label = '';
					temp.children = [];
					source.push(temp);
				}
				return source.map((item) => {
					if (columnIndex < steps - 1) {
						item.children = handle(item.children, columnIndex + 1);
					}
					return item;
				})
			}
			return handle(sourceData);
		},
		pickerChange: function (e) {

			this.setData({
				multiIndex: e.detail.value
			})
			this.processData();
		},
		processData: function () {
			const {
				sourceData,
				multiIndex
			} = this.data;
			let selectedArray = [];

			const handle = (source = [], columnIndex = 0) => {
				source.forEach((item, index) => {
					if (index === multiIndex[columnIndex]) {
						let node = dataHelper.deepClone(item);
						delete node.children;
						selectedArray.push(node);
						if (columnIndex < this.data.steps - 1) {
							handle(item.children, columnIndex + 1);
						}
					}
				})
			}
			handle(sourceData);

			this.setData({
				selectedArray
			});

			/*
			const detail = {
				selectedIndex: this.data.multiIndex,
				selectedArray: this.data.selectedArray
			}*/

			let ret = dataHelper.getArrByKey(selectedArray, 'val');

			this.triggerEvent('select', ret);
		},
		pickerColumnChange: function (e) {
			const {
				multiArray,
				sourceData,
				steps,
				initColumnSelectedIndex
			} = this.data;
			let {
				multiIndex
			} = this.data;
			const {
				column,
				value: changeIndex
			} = e.detail;
			multiIndex[column] = changeIndex;

			if (initColumnSelectedIndex) {
				const _multiIndex = multiIndex.map((item, index) => {
					if (column >= index) {
						return item;
					} else {
						return 0;
					}
				})
				multiIndex = _multiIndex;
			}

			const handle = (source = [], columnIndex = 0) => {
				source.forEach((item, index) => {
					if (index === multiIndex[columnIndex]) {
						if (columnIndex < steps - 1) {
							if (!item.children) {
								item.children = [];
							}
							const multiArrayItem = item.children.map((sub) => sub.label);
							multiArray[columnIndex + 1] = multiArrayItem;

							handle(item.children, columnIndex + 1);
						}
					}
				})
			}
			handle(sourceData);

			this.setData({
				multiArray,
				multiIndex,
			})
			this.triggerEvent('columnchange', e);
		},
		pickerCancel: function (e) {
			this.triggerEvent('cancel', e);
		},
		consoleError: function (...arg) {
			console.error(...arg);
		},


	},

})