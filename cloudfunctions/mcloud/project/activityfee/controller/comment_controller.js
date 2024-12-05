const BaseProjectController = require('./base_project_controller.js');
const CommentService = require('../service/comment_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class CommentController extends BaseProjectController {
	async getCommentList() {
		let rules = {
			oid: 'string|must',
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

		let service = new CommentService();
		let result = await service.getCommentList(input);
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].COMMENT_ADD_TIME = timeUtil.timestamp2Time(list[k].COMMENT_ADD_TIME, 'Y-M-D h:m:s');
		}

		return result;

	}
	async insertComment() {
		let rules = {
			oid: 'must|string',
			forms: 'array|name=表单',
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiClient(input);

		let service = new CommentService();
		let result = await service.insertComment(this._userId, input);

		return result;

	}
	async updateCommentForms() {
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiClient(input);

		let service = new CommentService();
		return await service.updateCommentForms(input);
	}
	async delComment() {
		let rules = {
			id: 'must|id',
			isAdmin: 'must|bool'
		};
		let input = this.validateData(rules);
 
		let service = new CommentService();
		if (input.isAdmin)
			await service.delComment(null, input.id);
		else
			await service.delComment(this._userId, input.id);

	}

}

module.exports = CommentController;