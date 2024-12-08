const BaseProjectService = require('./base_project_service.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');
const UserModel = require('../model/user_model.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');

class PassportService extends BaseProjectService {
	async register(userId, {
		userMobile,
		nickName,
		realName,
		userPic,
		gender,
		city,
		desc,
		resource,
		needs,
		forms,
		profession,
		employmentStatus,
		contactList,
		status
	}) {
		// Check if user exists
		let where = {
			USER_MINI_OPENID: userId
		}
		let cnt = await UserModel.count(where);
		if (cnt > 0)
			return await this.login(userId);

		// Check if mobile is registered
		where = {
			USER_MOBILE: userMobile
		}
		cnt = await UserModel.count(where);
		if (cnt > 0) this.AppError('该手机已注册');

		// Create new user
		let data = {
			USER_MINI_OPENID: userId,
			USER_MOBILE: userMobile,
			USER_NICK_NAME: nickName,
			USER_REAL_NAME: realName,
			USER_PIC: userPic,
			USER_GENDER: gender,
			USER_CITY: city,
			USER_DESC: desc,
			USER_RESOURCE: resource || '',
			USER_NEEDS: needs || '',
			USER_PROFESSION: profession,
			USER_EMPLOYMENT_STATUS: employmentStatus,
			USER_CONTACT_LIST: contactList || [],
			USER_OBJ: dataUtil.dbForms2Obj(forms),
			USER_FORMS: forms,
			USER_STATUS: Number(status)
		}
		await UserModel.insert(data);

		return await this.login(userId);
	}

	async getPhone(cloudID) {
		let cloud = cloudBase.getCloud();
		let res = await cloud.getOpenData({
			list: [cloudID], // 假设 event.openData.list 是一个 CloudID 字符串列表
		});
		if (res && res.list && res.list[0] && res.list[0].data) {
			let phone = res.list[0].data.phoneNumber;
			return phone;
		} else
			return '';
	}

	async getMyDetail(userId) {
		let where = {
			USER_MINI_OPENID: userId
		}
		let fields = 'USER_PIC,USER_MOBILE,USER_NAME,USER_REAL_NAME,USER_GENDER,USER_CITY,USER_DESC,USER_RESOURCE,USER_NEEDS,USER_FORMS,USER_OBJ,USER_STATUS,USER_CHECK_REASON'
		return await UserModel.getOne(where, fields);
	}

	async getUserDetail(userId) {
		let where = {
			_id: userId
		}
		let fields = '*';
		let user = await UserModel.getOne(where, fields);
		if (!user) return null;

		return user;
	}

	async editBase(userId, {
		userMobile,
		name,
		realName,
		userPic,
		gender,
		city,
		desc,
		resource,
		needs,
		forms,
		profession,
		employmentStatus,
		contactList
	}) {
		// Check if mobile is used by others
		let whereMobile = {
			USER_MOBILE: userMobile,
			USER_MINI_OPENID: ['<>', userId]
		}
		let cnt = await UserModel.count(whereMobile);
		if (cnt > 0) this.AppError('该手机已注册');

		let where = {
			USER_MINI_OPENID: userId
		}

		let user = await UserModel.getOne(where);
		if (!user) return;

		// Handle profile picture change
		if (user.USER_PIC && user.USER_PIC != userPic) {
			cloudUtil.deleteFiles(user.USER_PIC);
			let ActivityModel = require('../model/activity_model.js');
			let wherePic = {
				'ACTIVITY_USER_LIST.USER_MINI_OPENID': userId,
			}
			let dataPic = {
				'ACTIVITY_USER_LIST.$.USER_PIC': userPic
			}
			ActivityModel.edit(wherePic, dataPic);
		}

		// Update user data
		let data = {
			USER_MOBILE: userMobile,
			USER_NAME: name,
			USER_REAL_NAME: realName,
			USER_PIC: userPic,
			USER_GENDER: gender,
			USER_CITY: city,
			USER_DESC: desc,
			USER_RESOURCE: resource || '',
			USER_NEEDS: needs || '',
			USER_PROFESSION: profession,
			USER_EMPLOYMENT_STATUS: employmentStatus,
			USER_CONTACT_LIST: contactList || [],
			USER_OBJ: dataUtil.dbForms2Obj(forms),
			USER_FORMS: forms,
		};

		await UserModel.edit(where, data);
	}

	async editUser(userId, data) {
		let where = {
			_id: userId
		}

		let user = await UserModel.getOne(where);
		if (!user) return null;

		// 更新用户数据
		await UserModel.edit(where, data);

		return {
			result: 'ok'
		};
	}

	async login(userId) {
		let where = {
			USER_MINI_OPENID: userId
		}
		let fields = 'USER_ID,USER_MINI_OPENID,USER_NAME,USER_PIC,USER_STATUS,USER_CHECK_REASON';
		let user = await UserModel.getOne(where, fields);
		if (user) {
			if (user.USER_STATUS == UserModel.STATUS.UNCHECK || user.USER_STATUS == UserModel.STATUS.FORBID)
				this.AppError('账号已停用');

			if (user.USER_STATUS == UserModel.STATUS.UNUSE)
				this.AppError('账号待审核');

			await UserModel.inc(where, 'USER_LOGIN_CNT', 1);

			let data = {
				USER_LOGIN_TIME: this._timestamp
			}
			await UserModel.edit(where, data);
		}
		return user;
	}
}

module.exports = PassportService;