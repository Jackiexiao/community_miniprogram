const app = getApp();
Component({
	options: {
		addGlobalClass: true,
		multipleSlots: true
	},
	properties: {
		textColor: {
			type: String,
			value: 'text-white'
		},
		url: {
			type: String,
			value: '/projects/home/index/home_index'
		}
	},
	data: {
		method: 'back',
		statusBarHeight: app.globalData.statusBarHeight,
		customBarHeight: app.globalData.customBarHeight,
	},

	lifetimes: {
		attached() {
			let parentPages = getCurrentPages().length;
			if (parentPages == 1)
				this.setData({
					method: 'home'
				}); 
		}
	},
	methods: {
		bindTap() {
			if (this.data.method == 'back') {
				wx.navigateBack();
			} else
				wx.reLaunch({
					url: this.data.url,
				});
		}
	}
})