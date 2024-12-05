const behavior = require('../../../../../comm/behavior/about_bh.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const projectSetting = require('../../../public/project_setting.js');

Page({

	behaviors: [behavior],
	onLoad: async function (options) {
		ProjectBiz.initPage(this);

		if (options && options.key)
			this._loadDetail(options.key, projectSetting.SETUP_CONTENT_ITEMS);
	},

})