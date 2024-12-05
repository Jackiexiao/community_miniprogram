const BaseProjectAdminService = require('./base_project_admin_service.js');
const util = require('../../../../framework/utils/util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const AdminModel = require('../../../../framework/platform/model/admin_model.js');
const LogModel = require('../../../../framework/platform/model/log_model.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

class AdminMgrService extends BaseProjectAdminService {
	async adminLogin(name, password) {
		let where = {
			ADMIN_STATUS: 1,
			ADMIN_NAME: name,
			ADMIN_PASSWORD: md5Lib.md5(password)
		}
		let fields = 'ADMIN_ID,ADMIN_NAME,ADMIN_DESC,ADMIN_TYPE,ADMIN_LOGIN_TIME,ADMIN_LOGIN_CNT';
		let admin = await AdminModel.getOne(where, fields);
		if (!admin)
			this.AppError('管理员不存在或者已停用');

		let cnt = admin.ADMIN_LOGIN_CNT;
		let token = dataUtil.genRandomString(32);
		let tokenTime = timeUtil.time();
		let data = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: tokenTime,
			ADMIN_LOGIN_TIME: timeUtil.time(),
			ADMIN_LOGIN_CNT: cnt + 1
		}
		await AdminModel.edit(where, data);

		let type = admin.ADMIN_TYPE;
		let last = (!admin.ADMIN_LOGIN_TIME) ? '尚未登录' : timeUtil.timestamp2Time(admin.ADMIN_LOGIN_TIME);
		this.insertLog('登录了系统', admin, LogModel.TYPE.SYS);

		return {
			token,
			name: admin.ADMIN_NAME,
			type,
			last,
			cnt
		}

	}

	async clearLog() {
		await LogModel.clear();
	}
	async getLogList({
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
			LOG_ADD_TIME: 'desc'
		};
		let fields = '*';
		let where = {};

		if (util.isDefined(search) && search) {
			where.or = [{
				LOG_CONTENT: ['like', search]
			}, {
				LOG_ADMIN_DESC: ['like', search]
			}, {
				LOG_ADMIN_NAME: ['like', search]
			}];

		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'type':
					where.LOG_TYPE = Number(sortVal);
					break;
			}
		}
		let result = await LogModel.getList(where, fields, orderBy, page, size, true, oldTotal);


		return result;
	}
	async getMgrList({
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
		orderBy = {
			ADMIN_ADD_TIME: 'desc'
		}
		let fields = 'ADMIN_NAME,ADMIN_STATUS,ADMIN_PHONE,ADMIN_TYPE,ADMIN_LOGIN_CNT,ADMIN_LOGIN_TIME,ADMIN_DESC,ADMIN_EDIT_TIME,ADMIN_EDIT_IP';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};
		if (util.isDefined(search) && search) {
			where.or = [{
				ADMIN_NAME: ['like', search]
			},
			{
				ADMIN_PHONE: ['like', search]
			},
			{
				ADMIN_DESC: ['like', search]
			}
			];
		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'status':
					where.and.ADMIN_STATUS = Number(sortVal);
					break;
				case 'type':
					where.and.ADMIN_TYPE = Number(sortVal);
					break;
			}
		}

		return await AdminModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
	async delMgr(id, myAdminId) {
		if (id == myAdminId) this.AppError('不能删除自己');

		let where = {
			_id: id,
			ADMIN_TYPE: ['<>', 1]
		}
		await AdminModel.del(where);
	}

	async insertMgr({
		name,
		desc,
		phone,
		password
	}) {
		// 判断是否存在
		let where = {
			ADMIN_NAME: name
		}
		let cnt = await AdminModel.count(where);
		if (cnt > 0) this.AppError('该账号已存在');

		// 入库
		let data = {
			ADMIN_NAME: name,
			ADMIN_DESC: desc,
			ADMIN_PHONE: phone,
			ADMIN_PASSWORD: md5Lib.md5(password),
			ADMIN_TYPE: 0,
			ADMIN_STATUS: 1,
			ADMIN_ADD_TIME: timeUtil.time(),
			ADMIN_LOGIN_CNT: 0,
			ADMIN_LOGIN_TIME: 0,
			ADMIN_TOKEN: '',
			ADMIN_TOKEN_TIME: 0,
			ADMIN_EDIT_TIME: timeUtil.time(),
			ADMIN_EDIT_IP: this._ip,
		}
		await AdminModel.insert(data);
	}

	async statusMgr(id, status, myAdminId) {
		if (id == myAdminId) this.AppError('不能操作自己');

		let where = {
			_id: id,
			ADMIN_TYPE: ['<>', 1]
		}
		let data = {
			ADMIN_STATUS: status
		}
		await AdminModel.edit(where, data);
	}

	async getMgrDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let mgr = await AdminModel.getOne(where, fields);
		if (!mgr) return null;

		return mgr;
	}
	async editMgr(id, {
		name,
		desc,
		phone,
		password
	}) {
		let where = {
			ADMIN_NAME: name,
			_id: ['<>', id]
		}
		let cnt = await AdminModel.count(where);
		if (cnt > 0) this.AppError('该账号已存在');

		let data = {
			ADMIN_NAME: name,
			ADMIN_DESC: desc,
			ADMIN_PHONE: phone,
			ADMIN_EDIT_TIME: timeUtil.time(),
			ADMIN_EDIT_IP: this._ip,
		}
		if (password) data.ADMIN_PASSWORD = md5Lib.md5(password);

		await AdminModel.edit(id, data);
	}

	async pwdtMgr(adminId, oldPassword, password) {
		let where = {
			_id: adminId,
			ADMIN_PASSWORD: md5Lib.md5(oldPassword)
		}
		let admin = await AdminModel.getOne(where);
		if (!admin) this.AppError('旧密码错误');

		let data = {
			ADMIN_PASSWORD: md5Lib.md5(password),
			ADMIN_EDIT_TIME: timeUtil.time(),
			ADMIN_EDIT_IP: this._ip,
		}
		await AdminModel.edit(adminId, data);
	}
}

module.exports = AdminMgrService;