const BaseController = require('./base_controller.js');
const BaseAdminService = require('../service/base_admin_service.js');
const LogModel = require('../model/log_model.js');

const timeUtil = require('../../../framework/utils/time_util.js');

class BaseAdminController extends BaseController {

	constructor(route, openId, event) {
		super(route, openId, event);
		this._timestamp = timeUtil.time();

		this._admin = null;
		this._adminId = '0';

	}
	async isAdmin() {
		let service = new BaseAdminService();
		let admin = await service.isAdmin(this._token);
		this._admin = admin;
		this._adminId = admin._id;
	}
	async isSuperAdmin() {
		let service = new BaseAdminService();
		let admin = await service.isSuperAdmin(this._token);
		this._admin = admin;
		this._adminId = admin._id;
	}
	async log(content, type) {
		let service = new BaseAdminService();
		await service.insertLog(content, this._admin, type);
	}

	async logSys(content) {
		await this.log(content, LogModel.TYPE.SYS);
	}

	async logUser(content) {
		await this.log(content, LogModel.TYPE.USER);
	}

	async logOther(content) {
		await this.log(content, LogModel.TYPE.OTHER);
	}

	async logNews(content) {
		await this.log(content, LogModel.TYPE.NEWS);
	}

}

module.exports = BaseAdminController;