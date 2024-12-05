const pageHelper = require('../../../helper/page_helper.js');
Component({
	options: {
		addGlobalClass: true,
	},
	properties: {
		images: {
			type: Array,
			value: []
		},
		height: {
			type: Number,
			value: 350
		},
		mode: {
			type: String,
			value: 'aspectFill'
		},
		indicatorActiveColor: {
			type: String,
			value: '#000000'
		},
		interval: {
			type: Number,
			value: 3000
		},
		duration: {
			type: Number,
			value: 500
		},
		previousMargin: {
			type: Number,
			value: 0
		},
		nextMargin: {
			type: Number,
			value: 0
		},
		indicatorDots: {
			type: Boolean,
			value: true
		},
		autoplay: {
			type: Boolean,
			value: true
		},
		circular: {
			type: Boolean,
			value: true
		},
		vertical: {
			type: Boolean,
			value: false
		},
	},
	data: {

	},
	methods: {
		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})