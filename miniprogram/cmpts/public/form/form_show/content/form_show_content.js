const pageHelper = require('../../../../../helper/page_helper.js');
const helper = require('../../../../../helper/helper.js');

Page({
	data: {
		formContent: [{
			type: 'text',
			val: '',
		}],

		cmptId: '', // 父页面editor或者rows控件id
		cmptFormName: '', // 父页面show-content对应表单的名字或者索引

		cmptParentId: '', //父页面包含rows控件的控件id

		upDirectDir: '',//直接上传的目录
	},
	onLoad: async function (options) {

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		if (!options) return;

		if (!helper.isDefined(options.cmptId) || !helper.isDefined(options.cmptFormName)) return;
		let cmptId = '#' + options.cmptId;
		let cmptFormName = options.cmptFormName;
		let cmptParentId = '';
		if (options.cmptParentId) cmptParentId = '#' + options.cmptParentId;
 
		let formContent = [];
		if (!cmptParentId)
			formContent = parent.selectComponent(cmptId).getOneFormVal(cmptFormName);
		else
			formContent = parent.selectComponent(cmptParentId).selectComponent(cmptId).getOneFormVal(cmptFormName);

		if (formContent.length == 0) {
			formContent = [{ type: 'text', val: '' }];
		}

		this.setData({
			cmptId,
			cmptFormName,
			cmptParentId,

			formContent
		});
		if (options.upDirectDir) {
			this.setData({
				upDirectDir: options.upDirectDir
			});
		} 

		let curPage = pageHelper.getPrevPage(1);
		if (!curPage) return;
		if (curPage.options && curPage.options.source == 'admin') {
			wx.setNavigationBarColor({ //管理端顶部
				backgroundColor: '#2499f2',
				frontColor: '#ffffff',
			});
		}

	},
	onReady: function () {

	},
	onShow: function () { },
	onHide: function () {

	},
	onUnload: function () {

	},
	onPullDownRefresh: async function () {

	},

	model: function (e) {
		pageHelper.model(this, e);
	},


	url: function (e) {
		pageHelper.url(e, this);
	},

	bindSaveTap: function (e) {
		let formContent = this.selectComponent("#contentEditor").getNodeList();

		let parent = pageHelper.getPrevPage(2);
		if (!parent) return;

		if (!this.data.cmptParentId)
		parent.selectComponent(this.data.cmptId).setOneFormVal(this.data.cmptFormName, formContent);
		else
			parent.selectComponent(this.data.cmptParentId).selectComponent(this.data.cmptId).setOneFormVal(this.data.cmptFormName, formContent);

		wx.navigateBack();
	}
})