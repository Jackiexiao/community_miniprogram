const BaseProjectController = require('./base_project_controller.js');
const NewsService = require('../service/news_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class NewsController extends BaseProjectController {
	transNewsList(list) {
		let ret = [];
		for (let k = 0; k < list.length; k++) {
			let node = {};
			node.type = 'news';
			node.id = list[k]._id;
			node.title = list[k].NEWS_TITLE;
			node.desc = list[k].NEWS_DESC;
			node.ext = list[k].NEWS_ADD_TIME;
			node.pic = list[k].NEWS_PIC[0];
			ret.push(node);
		}
		return ret;
	} 
	async getNewsList() {
		let rules = {
			cateId: 'string',
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序', 
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};
		let input = this.validateData(rules);

		let service = new NewsService();
		let result = await service.getNewsList(input);
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].NEWS_ADD_TIME = timeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D');

			if (list[k].NEWS_OBJ && list[k].NEWS_OBJ.desc)
				delete list[k].NEWS_OBJ.desc;
		}
		result.list = this.transNewsList(list);

		return result;

	}
	async viewNews() {
		let rules = {
			id: 'must|id',
		};
		let input = this.validateData(rules);

		let service = new NewsService();
		let news = await service.viewNews(input.id);

		if (news) {
			news.NEWS_ADD_TIME = timeUtil.timestamp2Time(news.NEWS_ADD_TIME, 'Y-M-D');
		}

		return news;
	}



}

module.exports = NewsController;