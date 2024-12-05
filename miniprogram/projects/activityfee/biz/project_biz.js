const BaseBiz = require('../../../comm/biz/base_biz.js'); 
const projectSetting = require('../public/project_setting.js');
const PubilcBiz = require('../../../comm/biz/public_biz.js');
const PassportBiz = require('../../../comm/biz/passport_biz.js'); 

class ProjectBiz extends BaseBiz {
	static initPage(that, { isSetNavColor = true } = {}) {   

		let skin = {};
		skin.NAV_BG = projectSetting.NAV_BG;
		skin.NAV_COLOR = projectSetting.NAV_COLOR;
		skin.PROJECT_COLOR = projectSetting.PROJECT_COLOR;
		
		PubilcBiz.initPageBase(that, { skin, isSetNavColor });
	}

}

module.exports = ProjectBiz;