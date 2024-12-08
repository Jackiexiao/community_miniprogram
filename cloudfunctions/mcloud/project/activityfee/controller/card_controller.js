/**
 * Notes: 名片模块控制器
 * Date: 2024-01-20
 */

const BaseProjectController = require('./base_project_controller.js');
const CardService = require('../service/card_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const PassportService = require('../service/passport_service.js');

class CardController extends BaseProjectController {

	/** 列表 */
	async getList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			page: 'must|int|default=1',
			size: 'int|default=20',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CardService();
		let result = await service.getCardList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].USER_ADD_TIME = timeUtil.timestamp2Time(list[k].USER_ADD_TIME);
		}

		return result;
	}

	/** 浏览详细 */
	async getDetail() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CardService();
		let card = await service.getCardDetail(this._userId, input.id);
		if (card) {
			card.USER_ADD_TIME = timeUtil.timestamp2Time(card.USER_ADD_TIME);
		}

		return card;
	}

	/** 创建 */
	async insert() {
		let service = new PassportService();
		await service.checkLogin(this._userId);

		// 数据校验
		let rules = {
			forms: 'object|name=表单数据',
		};

		// 取得数据
		let input = this.validateData(rules);

		service = new CardService();
		let result = await service.insertCard({
			userId: this._userId,
			forms: input.forms
		});

		return result;
	}

	/** 更新 */
	async edit() {
		let service = new PassportService();
		await service.checkLogin(this._userId);

		// 数据校验
		let rules = {
			id: 'must|id',
			forms: 'object|name=表单数据',
		};

		// 取得数据
		let input = this.validateData(rules);

		service = new CardService();
		await service.updateCard({
			id: input.id,
			forms: input.forms
		});
	}

	/** 删除 */
	async del() {
		let service = new PassportService();
		await service.checkLogin(this._userId);

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		service = new CardService();
		await service.delCard(input.id);
	}

	/** 是否收藏 */
	async isFav() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new CardService();
		return await service.isFav(this._userId, input.id);
	}

	/** 切换收藏 */
	async toggleFav() {
		let service = new PassportService();
		await service.checkLogin(this._userId);

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		service = new CardService();
		return await service.toggleFav(this._userId, input.id);
	}
}

module.exports = CardController;
