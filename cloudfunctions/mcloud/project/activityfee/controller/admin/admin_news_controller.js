const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminNewsService = require('../../service/admin/admin_news_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const contentCheck = require('../../../../framework/validate/content_check.js');
const NewsModel = require('../../model/news_model.js');

class AdminNewsController extends BaseProjectAdminController {
	async sortNews() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		await service.sortNews(input.id, input.sort);
	} 
	async statusNews() {
		await this.isAdmin();
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		await service.statusNews(input.id, input.status);

	}
	async getAdminNewsList() {
		await this.isAdmin();
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		let result = await service.getAdminNewsList(input);
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D h:m');
			list[k].NEWS_EDIT_TIME = timeUtil.timestamp2Time(list[k].NEWS_EDIT_TIME, 'Y-M-D h:m');

			if (list[k].NEWS_OBJ && list[k].NEWS_OBJ.desc)
				delete list[k].NEWS_OBJ.desc;
		}
		result.list = list;

		return result;

	}
	async updateNewsContent() {
		await this.isAdmin();
		let rules = {
			id: 'must|id',
			content: 'array'
		};
		let input = this.validateData(rules);
			await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		return await service.updateNewsContent(input);
	}
	async insertNews() {
		await this.isAdmin();
		let rules = {
			title: 'must|string|min:4|max:50|name=标题',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名',
			order: 'must|int|min:0|max:9999|name=排序号',
			desc: 'must|string|min:10|max:200|name=简介',
			forms: 'array|name=表单',
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		let result = await service.insertNews(input);

		this.logNews('添加了文章《' + input.title + '》');

		return result;

	}
	async getNewsDetail() {
		await this.isAdmin();
		let rules = {
			id: 'must|id',
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		return await service.getNewsDetail(input.id);

	}
	async editNews() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			title: 'must|string|min:4|max:50|name=标题',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类',
			order: 'must|int|min:0|max:9999|name=排序号',
			desc: 'string|min:10|max:200|name=简介',
			forms: 'array|name=表单',
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		let result = service.editNews(input);

		this.logNews('修改了文章《' + input.title + '》');

		return result;
	}
	async delNews() {
		await this.isAdmin();
		let rules = {
			id: 'must|id',
		};
		let input = this.validateData(rules);

		let title = await NewsModel.getOneField(input.id, 'NEWS_TITLE');

		let service = new AdminNewsService();
		await service.delNews(input.id);

		if (title)
			this.logNews('删除了文章《' + title + '》');

	}
	async updateNewsPic() {
		await this.isAdmin();
		let rules = {
			id: 'must|id',
			imgList: 'array'
		};
		let input = this.validateData(rules);

		let service = new AdminNewsService();
		return await service.updateNewsPic(input);
	}
	async updateNewsForms() {
		await this.isAdmin();
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminNewsService();
		return await service.updateNewsForms(input);
	}

}

module.exports = AdminNewsController;