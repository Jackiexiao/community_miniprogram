const BaseProjectAdminController = require('./base_project_admin_controller.js');
const LogModel = require('../../../../framework/platform/model/log_model.js');

const AdminMgrService = require('../../service/admin/admin_mgr_service.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const contentCheck = require('../../../../framework/validate/content_check.js');

class AdminMgrController extends BaseProjectAdminController {
	async adminLogin() {
		let rules = {
			name: 'must|string|min:5|max:30|name=管理员名',
			pwd: 'must|string|min:5|max:30|name=密码',
		};
		let input = this.validateData(rules);

		let service = new AdminMgrService();
		return await service.adminLogin(input.name, input.pwd);
	}
	async delMgr() {
		await this.isSuperAdmin();
		let rules = {
			id: 'must|id',
		};
		let input = this.validateData(rules);

		let service = new AdminMgrService();
		await service.delMgr(input.id, this._adminId);

	}
	async statusMgr() {
		await this.isSuperAdmin();
		let rules = {
			id: 'must|id',
			status: 'must|int|in:0,1',
		};
		let input = this.validateData(rules);

		let service = new AdminMgrService();
		await service.statusMgr(input.id, input.status, this._admin.ADMIN_PHONE);
	}
	async getMgrList() {
		await this.isAdmin();
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int|default=10',
			isTotal: 'bool',
			oldTotal: 'int',
		};
		let input = this.validateData(rules);

		let service = new AdminMgrService();
		let result = await service.getMgrList(input);
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].ADMIN_EDIT_TIME = timeUtil.timestamp2Time(list[k].ADMIN_EDIT_TIME);
			list[k].ADMIN_LOGIN_TIME = (list[k].ADMIN_LOGIN_TIME == 0) ? '未登录' : timeUtil.timestamp2Time(list[k].ADMIN_LOGIN_TIME);
		}
		result.list = list;
		return result;
	}
	async insertMgr() {
		await this.isSuperAdmin();
		let rules = {
			name: 'must|string|min:5|max:30|name=账号',
			desc: 'must|string|max:30|name=姓名',
			phone: 'string|len:11|name=手机',
			password: 'must|string|min:6|max:30|name=密码',
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminMgrService();
		await service.insertMgr(input);
	}
	async editMgr() {
		await this.isSuperAdmin();
		let rules = {
			id: 'must|id|name=id',
			name: 'must|string|min:5|max:30|name=账号',
			desc: 'must|string|max:30|name=姓名',
			phone: 'string|len:11|name=手机',
			password: 'string|min:6|max:30|name=新密码',

		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminMgrService();
		await service.editMgr(input.id, input);
	}
	async pwdMgr() {
		await this.isAdmin();
		let rules = {
			oldPassword: 'must|string|min:6|max:30|name=旧密码',
			password: 'must|string|min:6|max:30|name=新密码',
			password2: 'must|string|min:6|max:30|name=新密码再次填写',

		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminMgrService();
		await service.pwdtMgr(this._adminId, input.oldPassword, input.password);
	}
	async getMgrDetail() {
		await this.isSuperAdmin();
		let rules = {
			id: 'must|id',
		};
		let input = this.validateData(rules);

		let service = new AdminMgrService();
		return await service.getMgrDetail(input.id);

	} 

	async clearLog() {
		await this.isAdmin();

		let service = new AdminMgrService();
		return await service.clearLog();

	}

	async getLogList() {
		await this.isAdmin();
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};
		let input = this.validateData(rules);

		let service = new AdminMgrService();
		let result = await service.getLogList(input);
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].LOG_TYPE_DESC = LogModel.getDesc('TYPE', list[k].LOG_TYPE);
			list[k].LOG_ADD_TIME = timeUtil.timestamp2Time(list[k].LOG_ADD_TIME);
		}
		result.list = list;

		return result;

	}
}

module.exports = AdminMgrController;