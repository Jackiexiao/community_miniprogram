Component({
	externalClasses: ['header-row-class-name', 'row-class-name', 'cell-class-name'],
	options: {
		styleIsolation: "isolated",
		multipleSlots: true // 支持多个slot
	},
	properties: {
		data: {
			type: Array,
			value: []
		},
		headers: {
			type: Array,
			value: []
		},
		height: {
			type: String,
			value: 'auto'
		},
		width: {
			type: Number || String,
			value: '100%'
		},
		tdWidth: {
			type: Number,
			value: 35
		},
		offsetTop: {
			type: Number,
			value: 150
		},
		stripe: {
			type: Boolean,
			value: false
		},
		border: {
			type: Boolean,
			value: false
		},
		msg: {
			type: String,
			value: '暂无数据~'
		}
	},
	data: {
		scrolWidth: '20%'
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

	}
})