const BaseProjectAdminService = require('./base_project_admin_service.js');
const UserModel = require('../../model/user_model.js'); 
const NewsModel = require('../../model/news_model.js');  
const ActivityModel = require('../../model/activity_model.js');
const constants = require('../../public/constants.js');
const setupUtil = require('../../../../framework/utils/setup/setup_util.js');

class AdminHomeService extends BaseProjectAdminService {
	async adminHome() {
		let where = {};

		let userCnt = await UserModel.count(where);
		let newsCnt = await NewsModel.count(where);
		let activityCnt = await ActivityModel.count(where);  
		return [
			{ title: '用户数', cnt: userCnt },
			{ title: '公告数', cnt: newsCnt },
			{ title: '活动数', cnt: activityCnt },  
		]
	}
	async clearUserData(userId) {

	}
	async clearVouchData() {
		await setupUtil.remove(constants.SETUP_HOME_VOUCH_KEY);

		NewsModel.edit({}, { NEWS_VOUCH: 0 });
		AlbumModel.edit({}, { ALBUM_VOUCH: 0 });
		EnrollModel.edit({}, { ENROLL_VOUCH: 0 });

	}
	async updateHomeVouch(node) {
		if (node.ext) node.ext = '#' + node.ext;
		let key = constants.SETUP_HOME_VOUCH_KEY;
		let list = await setupUtil.get(key);
		if (!list || !Array.isArray(list)) list = [];
		for (let k = 0; k < list.length; k++) {
			if (list[k].id == node.id) {
				list[k] = node;
				return await setupUtil.set(key, list, 'vouch');
			} 
		}
		let data = node;
		list.unshift(data);
		await setupUtil.set(key, list, 'vouch');

	}  
	async delHomeVouch(id) {
		let key = constants.SETUP_HOME_VOUCH_KEY;
		let list = await setupUtil.get(key);
		if (!list || !Array.isArray(list)) return;

		let newList = [];
		for (let k = 0; k < list.length; k++) {
			if (list[k].id != id) {
				newList.push(list[k]);
			}
		}

		return await setupUtil.set(key, newList, 'vouch');

	}  
}

module.exports = AdminHomeService;