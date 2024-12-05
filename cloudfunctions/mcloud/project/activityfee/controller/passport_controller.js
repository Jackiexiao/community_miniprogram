const BaseProjectController = require('./base_project_controller.js');
const PassportService = require('../service/passport_service.js');
const contentCheck = require('../../../framework/validate/content_check.js');

class PassportController extends BaseProjectController {
	async getMyDetail() {
		let service = new PassportService();
		return await service.getMyDetail(this._userId);
	}

	async getPhone() {
		let rules = {
			cloudID: 'must|string|min:1|max:200|name=cloudID',
		};
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.getPhone(input.cloudID);
	}

	async register() {
		let rules = {
			name: 'must|string|min:1|max:30|name=昵称',
			realName: 'must|string|min:2|max:30|name=真实姓名',
			mobile: 'must|mobile|name=手机',
			pic: 'must|string|name=头像',
			gender: 'must|int|in:0,1,2|name=性别',
			city: 'must|string|min:2|max:50|name=城市',
			desc: 'must|string|min:10|max:500|name=自我介绍',
			resource: 'string|max:500|name=可分享资源',
			needs: 'string|max:500|name=需求',
			forms: 'array|name=表单',
			status: 'int|default=1'
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiClient(input);

		let service = new PassportService();
		return await service.register(this._userId, input);
	}

	async editBase() {
		let rules = {
			name: 'must|string|min:1|max:30|name=昵称',
			realName: 'must|string|min:2|max:30|name=真实姓名',
			mobile: 'must|mobile|name=手机',
			pic: 'must|string|name=头像',
			gender: 'must|int|in:0,1,2|name=性别',
			city: 'must|string|min:2|max:50|name=城市',
			desc: 'must|string|min:10|max:500|name=自我介绍',
			resource: 'string|max:500|name=可分享资源',
			needs: 'string|max:500|name=需求',
			forms: 'array|name=表单',
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiClient(input);

		let service = new PassportService();
		return await service.editBase(this._userId, input);
	}

	async getUserDetail() {
		// 数据校验
		let rules = {
			userId: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new PassportService();
		let result = await service.getUserDetail(input.userId);

		return result;
	}

	async editUser() {
		// 数据校验
		let rules = {
			userId: 'must|id',
			data: 'must|object'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new PassportService();
		let result = await service.editUser(input.userId, input.data);

		return result;
	}

	async login() {
		let rules = {};
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.login(this._userId);
	}
}

module.exports = PassportController;