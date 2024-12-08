/**
 * Notes: 名片模块业务逻辑
 * Date: 2024-01-20
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const UserModel = require('../model/user_model.js');
const FavModel = require('../model/fav_model.js');

class CardService extends BaseProjectService {

	async getCardList(userId, {
		search,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		let where = {
			USER_STATUS: UserModel.STATUS.COMM
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ USER_NAME: ['like', search] },
				{ USER_REAL_NAME: ['like', search] },
				{ USER_DESC: ['like', search] }
			];
		}

		let orderBy = {
			USER_LOGIN_TIME: 'desc'
		};

		let fields = 'USER_NAME,USER_REAL_NAME,USER_MOBILE,USER_PIC,USER_GENDER,USER_CITY,USER_DESC,USER_LOGIN_TIME,USER_ADD_TIME';

		let result = await UserModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}

	async getCardDetail(userId, id) {
		let where = {
			_id: id,
			USER_STATUS: UserModel.STATUS.COMM
		}

		let fields = '*';
		let user = await UserModel.getOne(where, fields);
		if (!user) return null;

		return user;
	}

	async updateCard({
		id,
		forms
	}) {
		// 表单值
		let data = {};
		for (let k in forms) {
			data[k] = forms[k];
		}

		// 更新时间
		data.USER_EDIT_TIME = this._timestamp;

		await UserModel.edit(id, data);
	}

	async insertCard({
		userId,
		forms
	}) {
		// 表单值
		let data = {};
		for (let k in forms) {
			data[k] = forms[k];
		}

		// 创建时间
		data.USER_ADD_TIME = this._timestamp;
		data.USER_EDIT_TIME = this._timestamp;

		data.USER_ID = userId;
		data.USER_STATUS = UserModel.STATUS.COMM;

		return await UserModel.insert(data);
	}

	async delCard(id) {
		return await UserModel.edit(id, { USER_STATUS: UserModel.STATUS.FORBID });
	}

	// 收藏相关的功能
	async isFav(userId, cardId) {
		let where = {
			USER_ID: userId,
			CARD_ID: cardId
		}
		return await FavModel.count(where) > 0;
	}

	async toggleFav(userId, cardId) {
		let where = {
			USER_ID: userId,
			CARD_ID: cardId
		}

		let cnt = await FavModel.count(where);
		if (cnt > 0) {
			await FavModel.del(where);
			return false;
		} else {
			await FavModel.insert({
				USER_ID: userId,
				CARD_ID: cardId,
				ADD_TIME: this._timestamp,
				EDIT_TIME: this._timestamp,
				ADD_IP: this._ip,
				EDIT_IP: this._ip
			});
			return true;
		}
	}
}

module.exports = CardService;
