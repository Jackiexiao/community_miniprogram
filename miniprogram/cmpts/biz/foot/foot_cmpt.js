const pageHelper = require('../../../helper/page_helper');
const setting = require('../../../setting/setting.js');

Component({
	options: {
		addGlobalClass: true
	},
	properties: {
		color: {  
			type: String,
			value: ''
		},
	},
	data: {

	},

	lifetimes: {
		created: function () {
		},
		attached: function () {
		},
		ready: async function () {
			this._loadDetail();
		},
		move: function () {
		},
		detached: function () {
		},
	},
	methods: {
		_loadDetail: async function () {
			this.setData({
				company: setting.COMPANY,
				ver: setting.VER
			});
		},
		url: function (e) {
			pageHelper.url(e, this);
		}
	}
})