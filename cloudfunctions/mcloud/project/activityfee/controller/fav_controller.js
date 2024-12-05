const BaseProjectController = require('./base_project_controller.js');
const FavService = require('../service/fav_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class FavController extends BaseProjectController {
	async updateFav() {
		let rules = {
			oid: 'id|must',
			title: 'string|must',
			type: 'string|must',
			path: 'string|must',
		};
		let input = this.validateData(rules);

		let service = new FavService();
		return await service.updateFav(this._userId, input.oid, input.title, input.type, input.path);
	}
	async delFav() {
		let rules = {
			oid: 'id|must'
		};
		let input = this.validateData(rules);

		let service = new FavService();
		return await service.updateFav(this._userId, input.oid);
	}
	async isFav() {
		let rules = {
			oid: 'id|must',
		};
		let input = this.validateData(rules);

		let service = new FavService();
		return await service.isFav(this._userId, input.oid);
	}
	async getMyFavList() {
		let rules = {
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

		let service = new FavService();
		let result = await service.getMyFavList(this._userId, input);
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].FAV_ADD_TIME = timeUtil.timestamp2Time(list[k].FAV_ADD_TIME);
		}
		result.list = list;

		return result;

	}

}

module.exports = FavController;