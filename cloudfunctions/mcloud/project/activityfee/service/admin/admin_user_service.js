const BaseProjectAdminService = require('./base_project_admin_service.js');

const util = require('../../../../framework/utils/util.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const UserModel = require('../../model/user_model.js');
const AdminHomeService = require('./admin_home_service.js');
const EXPORT_USER_DATA_KEY = 'EXPORT_USER_DATA';

class AdminUserService extends BaseProjectAdminService {
	async getUser({
		userId,
		fields = '*'
	}) {
		let where = {
			USER_MINI_OPENID: userId,
		}
		return await UserModel.getOne(where, fields);
	}
	async getUserList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件 
		page,
		size,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			USER_ADD_TIME: 'desc'
		};
		let fields = '*';


		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				USER_NAME: ['like', search]
			},
			{
				USER_MOBILE: ['like', search]
			},
			{
				USER_MEMO: ['like', search]
			},
			];

		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'status':
					where.and.USER_STATUS = Number(sortVal);
					break; 
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'USER_ADD_TIME');
					break;
					}
			}
		}
		let result = await UserModel.getList(where, fields, orderBy, page, size, true, oldTotal, false);
		result.condition = encodeURIComponent(JSON.stringify(where));

		return result;
	}

	async statusUser(id, status, reason) {
		let data = {
			USER_STATUS: status,
			USER_CHECK_REASON: reason
		}
		await UserModel.edit(id, data);
	}

	async delUser(id) {
		let where = {
			_id: id
		}
		await UserModel.del(where);
	}

	async getUserDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_USER_DATA_KEY);
	}
	async deleteUserDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_USER_DATA_KEY);
	}
	async exportUserDataExcel(condition, fields) {
		let where = JSON.parse(decodeURIComponent(condition));

		let orderBy = {
			USER_ADD_TIME: 'desc'
		};

		let list = await UserModel.getAll(where, fields, orderBy);

		let header = [];
		let headerCn = [];

		for (let k = 0; k < fields.length; k++) {
			let key = fields[k].toLowerCase();
			if (key == 'user_add_time') {
				header.push('USER_ADD_TIME');
				headerCn.push('注册时间');
			}
			else if (key == 'user_name') {
				header.push('USER_NAME');
				headerCn.push('姓名');
			}
			else if (key == 'user_mobile') {
				header.push('USER_MOBILE');
				headerCn.push('手机');
			}
			else if (key == 'user_status') {
				header.push('USER_STATUS');
				headerCn.push('状态');
			}
			else if (key == 'user_memo') {
				header.push('USER_MEMO');
				headerCn.push('备注');
			}
		}

		let data = [];
		for (let k = 0; k < list.length; k++) {
			let node = list[k];
			let line = [];
			for (let j = 0; j < header.length; j++) {
				let val = node[header[j]];
				if (header[j] == 'USER_STATUS') {
					val = UserModel.getDesc('STATUS', val);
				}
				else if (header[j] == 'USER_ADD_TIME') {
					val = timeUtil.timestamp2Time(val);
				}

				line.push(val);
			}
			data.push(line);
		}

		await exportUtil.exportDataExcel(EXPORT_USER_DATA_KEY, '用户数据', headerCn, data);
	}
}

module.exports = AdminUserService;