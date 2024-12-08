/**
 * Notes: 名片收藏服务
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-10-20 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');

class CardFavService extends BaseProjectService {

	async insertCardFav(userId, cardId) {
		// 获取名片信息
		let card = await this.getOne('card', cardId);
		if (!card) throw new Error('名片不存在');

		// 是否已经收藏
		let where = {
			CARD_ID: cardId,
			USER_ID: userId
		}
		let cnt = await this.count('fav', where);
		if (cnt > 0) throw new Error('您已经收藏过此名片');

		// 入库
		let data = {
			USER_ID: userId,
			CARD_ID: cardId,
			ADD_TIME: this._timestamp(),
		}
		await this.insert('fav', data);

		// 更新名片收藏数
		await this.inc('card', cardId, 'FAV_CNT');
	}

	async delCardFav(userId, cardId) {
		// 是否已经收藏
		let where = {
			CARD_ID: cardId,
			USER_ID: userId
		}
		let cnt = await this.count('fav', where);
		if (cnt == 0) throw new Error('您还未收藏此名片');

		await this.del('fav', where);

		// 更新名片收藏数
		await this.inc('card', cardId, 'FAV_CNT', -1);
	}

	async isFav(userId, cardId) {
		let where = {
			CARD_ID: cardId,
			USER_ID: userId
		}
		let cnt = await this.count('fav', where);
		return cnt > 0;
	}

	async getMyCardFavList(userId, {
		search, // 搜索条件
		sortType, // 排序
		sortVal, // 排序值
		orderBy, // 排序
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		let where = {
			USER_ID: userId
		};

		let joinParams = {
			from: 'card',
			localField: 'CARD_ID',
			foreignField: '_id',
			as: 'card',
		};

		let result = await this.getListJoin({
			from: 'fav',
			joinParams,
			where,
			fields: 'card',
			page,
			size,
			isTotal,
			oldTotal,
			sortType,
			sortVal,
			orderBy
		});

		// 数据处理
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k] = list[k].card[0];
		}

		return result;
	}

}

module.exports = CardFavService;
