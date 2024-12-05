Component({
	options: {
		addGlobalClass: true,
		multipleSlots: true
	},

	externalClasses: ['slot-class'],
	properties: {
		type: { // 类型 comm/bottom/dialog/image
			type: String,
			value: 'comm'
		},
		title: {
			type: String,
			value: '温馨提示'
		},
		subtitle: {
			type: String,
			value: ''
		},
		subtitleAlign: {
			type: String,
			value: 'center'
		},
		show: {
			type: Boolean,
			value: true
		},
		cancelText: {
			type: String,
			value: '取消'
		},
		confirmText: {
			type: String,
			value: '确定'
		},
		showConfirm: {
			type: Boolean,
			value: true
		},
		imgURL: {
			type: String,
			value: ''
		},

		height: {
			type: Number,
			value: 600
		},
	},
	data: {

	},
	methods: {
		bindHideModalTap: function (e) {
			this.setData({
				show: ''
			})
		},

		nomove: function () {},

		bindComfirmTap: function (e) {
			this.triggerEvent('click', {});
		}
	}
})