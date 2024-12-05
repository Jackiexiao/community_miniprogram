const BaseBiz = require('../../../comm/biz/base_biz.js');
const projectSetting = require('../public/project_setting.js');
const formSetHelper = require('../../../cmpts/public/form/form_set_helper.js');

class CommentBiz extends BaseBiz {
	static initFormData() {

		return {
			fields: projectSetting.COMMENT_FIELDS,
			formForms: [], 
		}

	}


}

CommentBiz.CHECK_FORM = {
	forms: 'formForms|array',
};

module.exports = CommentBiz;