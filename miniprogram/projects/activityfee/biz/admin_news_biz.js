const BaseBiz = require('../../../comm/biz/base_biz.js');
const NewsBiz = require('./news_biz.js');
const projectSetting = require('../public/project_setting.js');

class AdminNewsBiz extends BaseBiz {
	static initFormData(id = '') {
		let cateIdOptions = NewsBiz.getCateList();

		return {
			id,

			contentDesc: '',
			cateIdOptions,

			fields: projectSetting.NEWS_FIELDS,
			imgList: [],
			formOrder: 9999,
			formTitle: '',
			formDesc: '',
			formContent: [],
			formCateId: (cateIdOptions.length == 1) ? cateIdOptions[0].val : '',
			formForms:[],
		}

	}

	static getCateName(cateId) {
		let cateList = projectSetting.NEWS_CATE;

		for (let k = 0; k < cateList.length; k++)  { 
			if (cateList[k].id == cateId) return cateList[k].title;
		}
		return '';
	}

}
AdminNewsBiz.CHECK_FORM = {
	title: 'formTitle|must|string|min:4|max:50|name=标题',
	cateId: 'formCateId|must|id|name=分类',
	order: 'formOrder|must|int|min:0|max:9999|name=排序号',
	desc: 'formDesc|string|min:10|max:200|name=简介',
	forms: 'formForms|array',
};


module.exports = AdminNewsBiz;