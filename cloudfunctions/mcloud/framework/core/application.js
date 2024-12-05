const util = require('../utils/util.js');
const cloudBase = require('../cloud/cloud_base.js');
const timeUtil = require('../utils/time_util.js');
const appUtil = require('./app_util.js');
const appCode = require('./app_code.js');
const appOther = require('./app_other.js');
const config = require('../../config/config.js');
global.PID = 'unknown';

async function app(event, context) {
	if (util.isDefined(event.outTradeNo)
		&& util.isDefined(event.userInfo)
		&& util.isDefined(event.attach)
		&& event.attach
	) {
		global.PID = event.attach;
		const PayService = require('../../project/' + global.PID + '/service/pay_service.js');
		console.log('##>> payBack,openId=' + event.userInfo.openId);
		let payService = new PayService();
		return payService.callbackPay(event);
	}
	let {
		eventX,
		isOther
	} = appOther.handlerOther(event);
	event = eventX;
	const cloud = cloudBase.getCloud();
	const wxContext = cloud.getWXContext();
	let r = '';
	let PID = '';
	try {

		if (!util.isDefined(event.route)) {
			showEvent(event);
			console.error('Route Not Defined');
			return appUtil.handlerSvrErr();
		}

		r = event.route.toLowerCase();
		if (!r.includes('/')) {
			showEvent(event);
			console.error('Route Format error[' + r + ']');
			return appUtil.handlerSvrErr();
		}

		PID = event.PID.trim();
		if (!PID) {
			showEvent(event);
			console.error('PID Is NULL]');
			return appUtil.handlerSvrErr();
		}
		global.PID = PID;
		routes = require('project/' + PID + '/controller/router.js');
		if (!util.isDefined(routes[r])) {
			showEvent(event);
			console.error('Route [' + r + '] Is Not Exist');
			return appUtil.handlerSvrErr();
		}

		let routesArr = routes[r].split('@');

		let controllerName = routesArr[0];
		let actionName = routesArr[1];
		if (actionName.includes('#')) {
			let actionNameArr = actionName.split('#');
			actionName = actionNameArr[0];
			if (actionNameArr[1] && config.IS_DEMO) {
				console.log('### APP Before = ' + actionNameArr[1]);
				return beforeApp(actionNameArr[1]);
			}
		}

		console.log('');
		console.log('');
		let time = timeUtil.time('Y-M-D h:m:s');
		let timeTicks = timeUtil.time();
		let openId = wxContext.OPENID;

		console.log('▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤▤');
		console.log(`【↘${time} ENV (${config.CLOUD_ID})】【Request Base↘↘↘】\n【↘Route =***${r}】\n【↘Controller = ${controllerName}】\n【↘Action = ${actionName}】\n【↘OPENID = ${openId}】\n【↘PID = ${global.PID}】`);
		if (config.TEST_MODE)
			openId = config.TEST_TOKEN_ID;

		if (!openId && r != 'job/timer') {
			console.error('OPENID is unfined');
			return appUtil.handlerSvrErr();
		}
		controllerName = controllerName.toLowerCase().trim();
		const ControllerClass = require('project/' + PID + '/controller/' + controllerName + '.js');
		const controller = new ControllerClass(r, PID + '^^^' + openId, event);
		await controller['initSetup']();
		let result = await controller[actionName]();
		if (isOther) {
			return result;
		} else {
			if (!result)
				result = appUtil.handlerSucc(r); // 无数据返回
			else
				result = appUtil.handlerData(result, r); // 有数据返回
		}


		console.log('------');
		time = timeUtil.time('Y-M-D h:m:s');
		timeTicks = timeUtil.time() - timeTicks;
		console.log(`【${time}】【Return Base↗↗↗】\n【↗Route =***${r}】\n【↗Duration = ${timeTicks}ms】\n【↗↗OUT DATA】= `, result);
		console.log('▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦');
		console.log('');
		console.log('');

		return result;


	} catch (ex) {
		const log = cloud.logger();

		console.log('------');
		time = timeUtil.time('Y-M-D h:m:s');
		console.error(`【${time}】【Return Base↗↗↗】\n【↗Route = ${r}】\Exception MSG = ${ex.message}, CODE=${ex.code}`);
		if (config.TEST_MODE && ex.name != 'AppError') throw ex;

		console.log('▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦');
		console.log('');
		console.log('');

		if (ex.name == 'AppError') {
			log.warn({
				route: r,
				errCode: ex.code,
				errMsg: ex.message
			});
			return appUtil.handlerAppErr(ex.message, ex.code);
		} else {
			log.error({
				route: r,
				errCode: ex.code,
				errMsg: ex.message,
				errStack: ex.stack
			});
			return appUtil.handlerSvrErr();
		}
	}
}
function beforeApp(method) {
	switch (method) {
		case 'demo': {
			return appUtil.handlerAppErr('todo: 演示用', appCode.LOGIC);
		}
	}
	console.error('事前处理, Method Not Find = ' + method);
}
function showEvent(event) {
	console.log(event);
}

module.exports = {
	app
}