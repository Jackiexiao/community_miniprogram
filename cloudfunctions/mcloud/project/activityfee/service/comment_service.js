const BaseProjectService = require('./base_project_service.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const CommentModel = require('../model/comment_model.js');
const UserModel = require('../model/user_model.js');

class CommentService extends BaseProjectService {

	async statComment(oid) {
		let cnt = await CommentModel.count({ COMMENT_OID: oid });
		let ActivityModel = require('../model/activity_model.js');
		await ActivityModel.edit(oid, { ACTIVITY_COMMENT_CNT: cnt });
	}

	async delComment(userId, id) {
		let where = {
			_id: id
		}
		if (userId) where.COMMENT_USER_ID = userId;

		let comment = await CommentModel.getOne(id);
		if (!comment) return;
		cloudUtil.handlerCloudFilesForForms(comment.COMMENT_FORMS, []);

		await CommentModel.del(where);

		this.statComment(comment.COMMENT_OID);
	}

	async insertComment(userId, {
		oid,
		forms
	}) {
		let ActivityJoinModel = require('../model/activity_join_model.js');
		let where = {
			ACTIVITY_JOIN_ACTIVITY_ID: oid,
			ACTIVITY_JOIN_USER_ID: userId,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
		}
		let cnt = await ActivityJoinModel.count(where);
		if (cnt == 0)
			this.AppError('您尚未报名或者报名待审核，不能发表评价');
		let data = {};
		data.COMMENT_USER_ID = userId;
		data.COMMENT_TYPE = 'activity';
		data.COMMENT_OID = oid;
		data.COMMENT_OBJ = dataUtil.dbForms2Obj(forms);
		data.COMMENT_FORMS = forms;

		let id = await CommentModel.insert(data);

		this.statComment(oid);

		return {
			id
		};
	}
	async updateCommentForms({
		id,
		hasImageForms
	}) {
		await CommentModel.editForms(id, 'COMMENT_FORMS', 'COMMENT_OBJ', hasImageForms);

	}

	async getCommentList({
		oid,
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal }) {
		orderBy = orderBy || {
			'COMMENT_ADD_TIME': 'desc'
		};
		let fields = 'COMMENT_ADD_TIME,COMMENT_USER_ID,COMMENT_OBJ,user.USER_NAME,user.USER_PIC';

		let where = { COMMENT_OID: oid };

		let joinParams = {
			from: UserModel.CL,
			localField: 'COMMENT_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

		return await CommentModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = CommentService;