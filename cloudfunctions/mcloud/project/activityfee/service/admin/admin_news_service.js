const BaseProjectAdminService = require('./base_project_admin_service.js'); 
const dataUtil = require('../../../../framework/utils/data_util.js');
const util = require('../../../../framework/utils/util.js'); 
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');

const NewsModel = require('../../model/news_model.js');

class AdminNewsService extends BaseProjectAdminService {
	async insertNews({
		title,
		cateId, //分类
		cateName,
		order,
		desc = '',
		forms
	}) {
		let data = {
			NEWS_TITLE: title,
			NEWS_CATE_ID: cateId,
			NEWS_CATE_NAME: cateName,
			NEWS_ORDER: order,
			NEWS_DESC: desc,
			NEWS_FORMS: forms,

			NEWS_STATUS: 1,
			NEWS_VOUCH: 0,

			NEWS_ADD_TIME: this._timestamp,
			NEWS_EDIT_TIME: this._timestamp,
		}

		let id = await NewsModel.insert(data);
		return id;
	}
	async delNews(id) {
		let where = {
			_id: id
		}
		await NewsModel.del(where);
	}
	async getNewsDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		return news;
	}
	async updateNewsForms({
		id,
		hasImageForms
	}) {
		let data = {
			NEWS_FORMS: hasImageForms
		}
		await NewsModel.edit(id, data);
	}
	async updateNewsContent({
		id,
		content // 富文本数组
	}) {
		let data = {
			NEWS_CONTENT: content,
			NEWS_EDIT_TIME: this._timestamp
		}
		await NewsModel.edit(id, data);
	}
	async updateNewsPic({
		id,
		imgList // 图片数组
	}) {
		let data = {
			NEWS_PIC: imgList,
			NEWS_EDIT_TIME: this._timestamp
		}
		await NewsModel.edit(id, data);
	}
	async editNews({
		id,
		title,
		cateId, //分类
		cateName,
		order,
		desc = '',
		forms
	}) {
		let data = {
			NEWS_TITLE: title,
			NEWS_CATE_ID: cateId,
			NEWS_CATE_NAME: cateName,
			NEWS_ORDER: order,
			NEWS_DESC: desc,
			NEWS_FORMS: forms,

			NEWS_EDIT_TIME: this._timestamp
		}
		await NewsModel.edit(id, data);
	}
	async getAdminNewsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = 'NEWS_TITLE,NEWS_DESC,NEWS_CATE_ID,NEWS_CATE_NAME,NEWS_EDIT_TIME,NEWS_ADD_TIME,NEWS_ORDER,NEWS_STATUS,NEWS_CATE2_NAME,NEWS_VOUCH,NEWS_QR,NEWS_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ NEWS_TITLE: ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'cateId': {
					where.and.NEWS_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.NEWS_STATUS = Number(sortVal);
					break;
				}
				case 'top': {
					where.and.NEWS_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'NEWS_ADD_TIME');
					break;
				}

			}
		}

		return await NewsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
	async statusNews(id, status) {
		let data = {
			NEWS_STATUS: status,
			NEWS_EDIT_TIME: this._timestamp
		}
		await NewsModel.edit(id, data);
	}
	async sortNews(id, sort) {
		let data = {
			NEWS_ORDER: sort,
			NEWS_EDIT_TIME: this._timestamp
		}
		await NewsModel.edit(id, data);
	}
}

module.exports = AdminNewsService;