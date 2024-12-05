const config = require('../../../config/config.js');
const timeUtil = require('../../utils/time_util.js');
const util = require('../../utils/util.js');
const dataCheck = require('../../validate/data_check.js');

const AppError = require('../../core/app_error.js');
const appCode = require('../../core/app_code.js');

class BaseController {

	constructor(route, openId, event) {

		this._route = route; // 路由
		this._openId = openId; //用户身份
		this._event = event; // 所有参数   
		this._request = event.params; //数据参数

		if (!openId) {
			console.error('OPENID is unfined');
			throw new AppError('OPENID is unfined', appCode.SVR);
		}

		let userId = openId;

		this._token = event.token || '';
		this._userId = userId;
		this._timestamp = timeUtil.time();
		let time = timeUtil.time('Y-M-D h:m:s');

		console.log('------------------------');
		console.log(`【${time}】【Request -- ↘↘↘】\n【↘Token = ${this._token}】\n【↘USER-ID = ${userId}】\n【↘↘IN DATA】=\n`, JSON.stringify(this._request, null, 4));

	}
	validateData(rules = {}) {
		let input = this._request;
		return dataCheck.check(input, rules);
	}
	getParameter(name) {
		let input = this._request;
		if (util.isDefined(input[name]))
			return input[name];
		else
			return '';
	}
}

module.exports = BaseController;