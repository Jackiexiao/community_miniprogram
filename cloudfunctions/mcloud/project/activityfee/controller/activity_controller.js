const BaseProjectController = require('./base_project_controller.js');
const ActivityService = require('../service/activity_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const dataUtil = require('../../../framework/utils/data_util.js');

class ActivityController extends BaseProjectController {

	_getTimeShow(start, end) {
		let startDay = timeUtil.timestamp2Time(start, 'M月D日');
		let startTime = timeUtil.timestamp2Time(start, 'h:m');
		let endDay = timeUtil.timestamp2Time(end, 'M月D日');
		let endTime = timeUtil.timestamp2Time(end, 'h:m');
		let week = timeUtil.week(timeUtil.timestamp2Time(start, 'Y-M-D'));
		if (startDay != endDay)
			return `${startDay} ${startTime} ${week}～${endDay} ${endTime}`;
		else
			return `${startDay} ${startTime}～${endTime} ${week}`;
	}
	async getActivityList() {
		let rules = {
			cateId: 'string',
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		let result = await service.getActivityList(input);
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			if (list[k].ACTIVITY_START_DAY == list[k].ACTIVITY_END_DAY) {
				list[k].time = list[k].ACTIVITY_START_DAY + ' ' + timeUtil.week(list[k].ACTIVITY_START_DAY);
			}
			else {
				list[k].time = list[k].ACTIVITY_START_DAY + ' ~ ' + list[k].ACTIVITY_END_DAY;
			}

			list[k].statusDesc = service.getJoinStatusDesc(list[k]);

			if (list[k].ACTIVITY_OBJ && list[k].ACTIVITY_OBJ.desc)
				delete list[k].ACTIVITY_OBJ.desc;
		}

		return result;

	}
	async viewActivity() {
		let rules = {
			id: 'must|id',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		let activity = await service.viewActivity(this._userId, input.id);

		if (activity) {
			activity.stop = timeUtil.timestamp2Time(activity.ACTIVITY_STOP, 'Y-M-D h:m');

			activity.start = timeUtil.timestamp2Time(activity.ACTIVITY_START, 'M月D日 h:m');

			activity.time = this._getTimeShow(activity.ACTIVITY_START, activity.ACTIVITY_END);
			activity.statusDesc = service.getJoinStatusDesc(activity);

			activity.ACTIVITY_FEE = Number(dataUtil.fmtMoney(activity.ACTIVITY_FEE / 100));
		}

		return activity;
	}
	async getActivityJoinList() {
		let rules = {
			activityId: 'id',
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		let result = await service.getActivityJoinList(input.activityId, input);
		let list = result.list;


		for (let k = 0; k < list.length; k++) {

			list[k].ACTIVITY_JOIN_ADD_TIME = timeUtil.timestamp2Time(list[k].ACTIVITY_JOIN_ADD_TIME, 'Y-M-D h:m');
		}

		result.list = list;

		return result;

	}
	async getMyActivityJoinList() {
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		let result = await service.getMyActivityJoinList(this._userId, input);
		let list = result.list;


		for (let k = 0; k < list.length; k++) {
			list[k].time = this._getTimeShow(list[k].activity.ACTIVITY_START, list[k].activity.ACTIVITY_END);

			list[k].ACTIVITY_JOIN_ADD_TIME = timeUtil.timestamp2Time(list[k].ACTIVITY_JOIN_ADD_TIME, 'Y-M-D h:m');
		}

		result.list = list;

		return result;

	}
	async getMyActivityJoinDetail() {
		let rules = {
			activityJoinId: 'must|id',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		let activityJoin = await service.getMyActivityJoinDetail(this._userId, input.activityJoinId);
		if (activityJoin) {
			activityJoin.ACTIVITY_JOIN_CANCEL_TIME = timeUtil.timestamp2Time(activityJoin.ACTIVITY_JOIN_CANCEL_TIME);
			activityJoin.ACTIVITY_JOIN_ADD_TIME = timeUtil.timestamp2Time(activityJoin.ACTIVITY_JOIN_ADD_TIME);
			activityJoin.ACTIVITY_JOIN_CHECKIN_TIME = timeUtil.timestamp2Time(activityJoin.ACTIVITY_JOIN_CHECKIN_TIME);
			activityJoin.time = this._getTimeShow(activityJoin.activity.ACTIVITY_START, activityJoin.activity.ACTIVITY_END);


			activityJoin.ACTIVITY_JOIN_PAY_FEE = Number(dataUtil.fmtMoney(activityJoin.ACTIVITY_JOIN_PAY_FEE / 100));
		}
		return activityJoin;

	}
	async detailForActivityJoin() {
		let rules = {
			activityId: 'must|id',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		let meet = await service.detailForActivityJoin(this._userId, input.activityId);

		if (meet) {
		}

		return meet;
	}
	async prepay() {
		let rules = {
			activityId: 'must|id',
			forms: 'must|array',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		return await service.prepay(this._userId, input.activityId, input.forms);
	}
	async cancelMyActivityJoin() {
		let rules = {
			activityJoinId: 'must|id',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		return await service.cancelMyActivityJoin(this._userId, input.activityJoinId);
	}
	async myJoinSelf() {
		let rules = {
			activityId: 'must|id',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		return await service.myJoinSelf(this._userId, input.activityId);
	}
	async getActivityListByDay() {
		let rules = {
			day: 'must|date|name=日期',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		let list = await service.getActivityListByDay(input.day);
		return list;


	}
	async getActivityHasDaysFromDay() {
		let rules = {
			day: 'must|date|name=日期',
		};
		let input = this.validateData(rules);

		let service = new ActivityService();
		let list = await service.getActivityHasDaysFromDay(input.day);
		return list;

	}

}

module.exports = ActivityController;