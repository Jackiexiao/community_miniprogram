const dbUtil = require('../../../framework/database/db_util.js');
const util = require('../../../framework/utils/util.js');
const AdminModel = require('../../../framework/platform/model/admin_model.js');
const NewsModel = require('../model/news_model.js');
const ActivityModel = require('../model/activity_model.js');
const BaseService = require('../../../framework/platform/service/base_service.js');

class BaseProjectService extends BaseService {
	getProjectId() {
		return util.getProjectId();
	}

	_getFullCollection(collection) {
		return 'bx_' + collection;
	}

	async count(collection, where) {
		return await dbUtil.count(this._getFullCollection(collection), where);
	}

	async insert(collection, data) {
		return await dbUtil.insert(this._getFullCollection(collection), data);
	}

	async del(collection, where) {
		return await dbUtil.del(this._getFullCollection(collection), where);
	}

	async inc(collection, where, field, val = 1) {
		return await dbUtil.inc(this._getFullCollection(collection), where, field, val);
	}

	async getOne(collection, where, fields = '*', orderBy = {}) {
		return await dbUtil.getOne(this._getFullCollection(collection), where, fields, orderBy);
	}

	async initSetup() {

		let F = (c) => this._getFullCollection(c);
		const INSTALL_CL = 'setup_activityfee';
		const COLLECTIONS = ['setup', 'admin', 'log', 'news', 'activity', 'activity_join', 'comment', 'fav', 'user', 'pay'];
		// 默认图片为空，前端会显示占位图
		const CONST_PIC = '';


		const NEWS_CATE = '1=通知公告';
		const ACTIVITY_CATE = '1=展览市集,2=交友聚会,3=运动健康,4=休闲娱乐,5=儿童亲子,6=户外出游,7=演出曲艺,8=读书会,9=公益活动,10=学术讲座,11=行业活动,12=其他活动';


		if (await dbUtil.isExistCollection(F(INSTALL_CL))) {
			return;
		}

		console.log('### initSetup...');

		let arr = COLLECTIONS;
		for (let k = 0; k < arr.length; k++) {
			if (!await dbUtil.isExistCollection(F(arr[k]))) {
				await dbUtil.createCollection(F(arr[k]));
			}
		}

		if (await dbUtil.isExistCollection(F('admin'))) {
			let adminCnt = await AdminModel.count({});
			if (adminCnt == 0) {
				let data = {};
				data.ADMIN_NAME = 'admin';
				data.ADMIN_PASSWORD = 'e10adc3949ba59abbe56e057f20f883e';
				data.ADMIN_DESC = '超管';
				data.ADMIN_TYPE = 1;
				await AdminModel.insert(data);
			}
		}


		if (await dbUtil.isExistCollection(F('news'))) {
			let newsCnt = await NewsModel.count({});
			if (newsCnt == 0) {
				let newsArr = NEWS_CATE.split(',');
				for (let j in newsArr) {
					let title = newsArr[j].split('=')[1];
					let cateId = newsArr[j].split('=')[0];

					let data = {};
					data.NEWS_TITLE = title + '标题1';
					data.NEWS_DESC = title + '简介1';
					data.NEWS_CATE_ID = cateId;
					data.NEWS_CATE_NAME = title;
					data.NEWS_CONTENT = [{ type: 'text', val: title + '内容1' }];
					data.NEWS_PIC = [CONST_PIC];

					await NewsModel.insert(data);
				}
			}
		}

		if (await dbUtil.isExistCollection(F('activity'))) {
			let activityCnt = await ActivityModel.count({});
			if (activityCnt == 0) {
				let activityArr = ACTIVITY_CATE.split(',');
				for (let j in activityArr) {
					let title = activityArr[j].split('=')[1];
					let cateId = activityArr[j].split('=')[0];

					let data = {};
					data.ACTIVITY_TITLE = title + '1';
					data.ACTIVITY_CATE_ID = cateId;
					data.ACTIVITY_CATE_NAME = title;
					data.ACTIVITY_ADDRESS = '湖南省长沙市岳麓山';
					data.ACTIVITY_START = this._timestamp;
					data.ACTIVITY_END = this._timestamp + 86400 * 1000 * 30;
					data.ACTIVITY_STOP = this._timestamp + 86400 * 1000 * 30;
					data.ACTIVITY_JOIN_FORMS = [
						{ mark: 'name', type: 'text', title: '姓名', must: true },
						{ mark: 'phone', type: 'mobile', title: '手机', must: true }
					];
					data.ACTIVITY_OBJ = {
						cover: [CONST_PIC],
						img: [CONST_PIC],
						time: 3,
						fee: '100',
						desc: [{ type: 'text', val: title + '1详情介绍' }]
					};

					await ActivityModel.insert(data);
				}
			}
		}


		if (!await dbUtil.isExistCollection(F(INSTALL_CL))) {
			await dbUtil.createCollection(F(INSTALL_CL));
		}
	}

}

module.exports = BaseProjectService;