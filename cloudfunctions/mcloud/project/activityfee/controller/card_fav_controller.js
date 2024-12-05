/**
 * Notes: 名片收藏控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-10-20 07:48:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const CardFavService = require('../service/card_fav_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class CardFavController extends BaseProjectController {

	/** 收藏名片 */
	async insertCardFav() {
		// 数据校验
		let rules = {
			cardId: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CardFavService();
		await service.insertCardFav(this._userId, input.cardId);
	}

	/** 取消收藏名片 */
	async delCardFav() {
		// 数据校验
		let rules = {
			cardId: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CardFavService();
		await service.delCardFav(this._userId, input.cardId);
	}

	/** 我的名片收藏列表 */
	async getMyCardFavList() {
		// 数据校验
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

		// 取得数据
		let input = this.validateData(rules);

		let service = new CardFavService();
		let result = await service.getMyCardFavList(this._userId, input);

		return result;

	}

	/** 检查是否已收藏 */
	async isFav() {
		// 数据校验
		let rules = {
			cardId: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CardFavService();
		let isFav = await service.isFav(this._userId, input.cardId);
		return isFav;
	}

}

module.exports = CardFavController;
