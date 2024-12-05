const BaseProjectAdminService = require('./base_project_admin_service.js');
const ActivityService = require('../activity_service.js');
const AdminHomeService = require('../admin/admin_home_service.js');
const util = require('../../../../framework/utils/util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const ActivityModel = require('../../model/activity_model.js');
const ActivityJoinModel = require('../../model/activity_join_model.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const EXPORT_ACTIVITY_JOIN_DATA_KEY = 'EXPORT_ACTIVITY_JOIN_DATA';

class AdminActivityService extends BaseProjectAdminService {
	async getAdminActivityList({
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

		orderBy = orderBy || {
			'ACTIVITY_ORDER': 'asc',
			'ACTIVITY_ADD_TIME': 'desc'
		};
		let fields = 'ACTIVITY_METHOD,ACTIVITY_PAY_CNT,ACTIVITY_FEE,ACTIVITY_PAY_FEE,ACTIVITY_JOIN_CNT,ACTIVITY_TITLE,ACTIVITY_CATE_ID,ACTIVITY_CATE_NAME,ACTIVITY_EDIT_TIME,ACTIVITY_ADD_TIME,ACTIVITY_ORDER,ACTIVITY_STATUS,ACTIVITY_VOUCH,ACTIVITY_MAX_CNT,ACTIVITY_START,ACTIVITY_END,ACTIVITY_STOP,ACTIVITY_CANCEL_SET,ACTIVITY_CHECK_SET,ACTIVITY_QR,ACTIVITY_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				ACTIVITY_TITLE: ['like', search]
			},];

		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'cateId': {
					where.and.ACTIVITY_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.ACTIVITY_STATUS = Number(sortVal);
					break;
				}
				case 'vouch': {
					where.and.ACTIVITY_VOUCH = 1;
					break;
				}
				case 'top': {
					where.and.ACTIVITY_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'ACTIVITY_ADD_TIME');
					break;
				}
			}
		}

		return await ActivityModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
	async sortActivity(id, sort) {
		sort = Number(sort);
		let data = {};
		data.ACTIVITY_ORDER = sort;
		await ActivityModel.edit(id, data);
	}
	async getActivityDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}

		let activity = await ActivityModel.getOne(where, fields);
		if (!activity) return null;

		return activity;
	}
	async vouchActivity(id, vouch) {
		let data = {
			ACTIVITY_VOUCH: vouch ? 1 : 0
		};
		await ActivityModel.edit(id, data);
	}
	async insertActivity(data) {
		console.log("Service层接收到的数据：", data);

		let timestamp = timeUtil.time();
		let startTime = timeUtil.time2Timestamp(data.start);
		let endTime = timeUtil.time2Timestamp(data.end);
		let stopTime = timeUtil.time2Timestamp(data.stop);

		let newData = {
			_pid: this.getProjectId(),
			ACTIVITY_ID: dataUtil.genRandomString(16),

			ACTIVITY_TITLE: data.title,
			ACTIVITY_CATE_ID: data.cateId,
			ACTIVITY_CATE_NAME: data.cateName,
			ACTIVITY_ORDER: data.order,

			ACTIVITY_MAX_CNT: data.maxCnt,
			ACTIVITY_START: startTime,
			ACTIVITY_END: endTime,
			ACTIVITY_STOP: stopTime,

			ACTIVITY_START_MONTH: timeUtil.time('Y-M', startTime),
			ACTIVITY_END_MONTH: timeUtil.time('Y-M', endTime),
			ACTIVITY_START_DAY: timeUtil.time('Y-M-D', startTime),
			ACTIVITY_END_DAY: timeUtil.time('Y-M-D', endTime),

			ACTIVITY_METHOD: 0,
			ACTIVITY_FEE: 0,

			ACTIVITY_ADDRESS: data.address || '',
			ACTIVITY_ADDRESS_GEO: data.addressGeo || {},

			ACTIVITY_CHECK_SET: data.checkSet,
			ACTIVITY_CANCEL_SET: data.cancelSet,
			ACTIVITY_IS_MENU: data.isMenu,

			ACTIVITY_OBJ: data.activityObj || {
				cover: [],
				time: 2,
				desc: [{
					type: 'text',
					val: '活动详情介绍'
				}],
				img: []
			},

			ACTIVITY_FORMS: data.forms || [],
			ACTIVITY_JOIN_FORMS: data.joinForms || [],

			ACTIVITY_STATUS: 1,
			ACTIVITY_VOUCH: 0,
			ACTIVITY_VIEW_CNT: 0,
			ACTIVITY_COMMENT_CNT: 0,
			ACTIVITY_JOIN_CNT: 0,
			ACTIVITY_PAY_CNT: 0,
			ACTIVITY_PAY_FEE: 0,
			ACTIVITY_USER_LIST: [],

			ACTIVITY_ADD_TIME: timestamp,
			ACTIVITY_EDIT_TIME: timestamp,
		}

		console.log("准备插入数据库的数据：", newData);

		try {
			let id = await ActivityModel.insert(newData);
			return { id };
		} catch (err) {
			console.error("数据库插入错误：", err);
			throw err;
		}
	}
	async delActivity(id) {
		let where = {
			_id: id
		}
			await ActivityModel.del(where);
	}
	async updateActivityForms({
		id,
		hasImageForms
	}) {
		let data = {
			ACTIVITY_FORMS: hasImageForms
		}
		await ActivityModel.edit(id, data);
	}
	async editActivity({
		id,
		title,
		cateId,
		cateName,
		maxCnt,
		start,
		end,
		stop,
		method,
		fee,
		address,
		addressGeo,
		cancelSet,
		checkSet,
		isMenu,
		order,
		forms,
		joinForms
	}) {
		let data = {
			ACTIVITY_TITLE: title,
			ACTIVITY_CATE_ID: cateId,
			ACTIVITY_CATE_NAME: cateName,

			ACTIVITY_MAX_CNT: maxCnt,
			ACTIVITY_START: start,
			ACTIVITY_END: end,
			ACTIVITY_STOP: stop,

			ACTIVITY_METHOD: method,
			ACTIVITY_FEE: fee,

			ACTIVITY_ADDRESS: address,
			ACTIVITY_ADDRESS_GEO: addressGeo,

			ACTIVITY_CANCEL_SET: cancelSet,
			ACTIVITY_CHECK_SET: checkSet,
			ACTIVITY_IS_MENU: isMenu,

			ACTIVITY_ORDER: order,
			ACTIVITY_FORMS: forms,
			ACTIVITY_JOIN_FORMS: joinForms,

			ACTIVITY_EDIT_TIME: this._timestamp,

			ACTIVITY_START_MONTH: timeUtil.time('Y-M', start),
			ACTIVITY_END_MONTH: timeUtil.time('Y-M', end),
			ACTIVITY_START_DAY: timeUtil.time('Y-M-D', start),
			ACTIVITY_END_DAY: timeUtil.time('Y-M-D', end),
		}
		await ActivityModel.edit(id, data);
	}
	async statusActivity(id, status) {
		let data = {
			ACTIVITY_STATUS: status
		}
		await ActivityModel.edit(id, data);
	}
	async getActivityJoinList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		activityId,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'ACTIVITY_JOIN_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {
			ACTIVITY_JOIN_ACTIVITY_ID: activityId
		};
		if (util.isDefined(search) && search) {
			where['ACTIVITY_JOIN_FORMS.val'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			switch (sortType) {
				case 'status':
					where.ACTIVITY_JOIN_STATUS = Number(sortVal);
					break;
				case 'checkin':
					where.ACTIVITY_JOIN_STATUS = ActivityJoinModel.STATUS.SUCC;
					if (sortVal == 1) {
						where.ACTIVITY_JOIN_IS_CHECKIN = 1;
					} else {
						where.ACTIVITY_JOIN_IS_CHECKIN = 0;
					}
					break;
			}
		}

		return await ActivityJoinModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}
	async passActivityJoin(activityJoinId) {
		let activityJoin = await ActivityJoinModel.getOne(activityJoinId);
		if (!activityJoin) return;

		let data = {
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
		}
		await ActivityJoinModel.edit(activityJoinId, data);

		let activityService = new ActivityService();
		await activityService.statActivityJoin(activityJoin.ACTIVITY_JOIN_ACTIVITY_ID);
	}
	async cancelActivityJoin(activityJoinId, reason) {
		let activityJoin = await ActivityJoinModel.getOne(activityJoinId);
		if (!activityJoin) return;

		let data = {
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.ADMIN_CANCEL,
			ACTIVITY_JOIN_REASON: reason
		}
		await ActivityJoinModel.edit(activityJoinId, data);

		let activityService = new ActivityService();
		await activityService.statActivityJoin(activityJoin.ACTIVITY_JOIN_ACTIVITY_ID);
	}
	async checkinActivityJoin(activityJoinId, flag) {
		let activityJoin = await ActivityJoinModel.getOne(activityJoinId);
		if (!activityJoin) return;

		let data = {
			ACTIVITY_JOIN_IS_CHECKIN: flag ? 1 : 0
		}
		await ActivityJoinModel.edit(activityJoinId, data);
	}
	async scanActivityJoin(activityId, code) {
		let where = {
			ACTIVITY_JOIN_ACTIVITY_ID: activityId,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC,
			ACTIVITY_JOIN_CODE: code
		}
		let activityJoin = await ActivityJoinModel.getOne(where);
		if (!activityJoin) this.AppError('该活动码不存在或者已经失效');

		let data = {
			ACTIVITY_JOIN_IS_CHECKIN: 1
		}
		await ActivityJoinModel.edit(activityJoin._id, data);

		return {
			activityJoinId: activityJoin._id
		};
	}
	async getActivityJoinDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_ACTIVITY_JOIN_DATA_KEY);
	}
	async deleteActivityJoinDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_ACTIVITY_JOIN_DATA_KEY);
	}
	async exportActivityJoinDataExcel({
		activityId,
		status
	}) {
		let activity = await ActivityModel.getOne(activityId);
		if (!activity) return;

		let where = {
			ACTIVITY_JOIN_ACTIVITY_ID: activityId
		}
		if (status && status !== 'all') where.ACTIVITY_JOIN_STATUS = Number(status);

		let orderBy = {
			ACTIVITY_JOIN_ADD_TIME: 'asc'
		};

		let list = await ActivityJoinModel.getAll(where, '*', orderBy);

		let header = [];
		header.push('报名时间');
		header.push('状态');
		header.push('缴费状态');
		header.push('签到状态');

		let forms = activity.ACTIVITY_JOIN_FORMS;
		for (let k = 0; k < forms.length; k++) {
			header.push(forms[k].title);
		}

		let data = [];
		for (let k = 0; k < list.length; k++) {
			let node = list[k];
			let line = [];
			line.push(timeUtil.timestamp2Time(node.ACTIVITY_JOIN_ADD_TIME));

			switch (Number(node.ACTIVITY_JOIN_STATUS)) {
				case ActivityJoinModel.STATUS.WAIT:
					line.push('待审核');
					break;
				case ActivityJoinModel.STATUS.SUCC:
					line.push('报名成功');
					break;
				case ActivityJoinModel.STATUS.ADMIN_CANCEL:
					line.push('未通过审核');
					break;
				case ActivityJoinModel.STATUS.CANCEL:
					line.push('已取消');
					break;
				case ActivityJoinModel.STATUS.OUT:
					line.push('系统取消');
					break;
			}

			line.push((node.ACTIVITY_JOIN_PAY_STATUS == 1) ? '已缴费' : '未缴费');
			line.push((node.ACTIVITY_JOIN_IS_CHECKIN == 1) ? '已签到' : '未签到');

			let forms = node.ACTIVITY_JOIN_FORMS;
			for (let k = 0; k < forms.length; k++) {
				let val = forms[k].val;
				if (Array.isArray(val))
					val = val.join(',');
				line.push(val);
			}
			data.push(line);
		}

		let fileName = '活动报名名单-' + activity.ACTIVITY_TITLE;

		await exportUtil.exportDataExcel(EXPORT_ACTIVITY_JOIN_DATA_KEY, fileName, header, data);
	}
	async genActivitySelfCheckinQr(page, activityId) {
		// 生成小程序码
		let cloud = cloudBase.getCloud();
		let result = await cloud.openapi.wxacode.getUnlimited({
			scene: activityId,
			page: page,
			width: 280,
			check_path: false
		});

		let cloudPath = 'activity/qr/' + activityId + '.png';
		let upload = await cloud.uploadFile({
			cloudPath,
			fileContent: result.buffer,
		});

		// 获取文件的临时链接
		let urls = await cloud.getTempFileURL({
			fileList: [upload.fileID],
		});

		// 更新活动的二维码链接
		let data = {
			ACTIVITY_QR: urls.fileList[0].tempFileURL
		}
		await ActivityModel.edit(activityId, data);

		return urls.fileList[0].tempFileURL;
	}
}

module.exports = AdminActivityService;