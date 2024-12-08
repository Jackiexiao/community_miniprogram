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
		console.log('[Get Phone Controller] 接收到的数据:', this._request);
		console.log('[Get Phone Controller] 验证规则:', rules);
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.getPhone(input.cloudID);
	}

	async register() {
		let rules = {
			nickName: 'must|string|min:1|max:30|name=昵称',
			realName: 'must|string|min:2|max:30|name=真实姓名',
			userMobile: 'must|mobile|name=手机',
			userPic: 'must|string|name=头像',
			gender: 'must|string|in:unknown,male,female,other|name=性别',
			profession: 'must|string|in:dev,product,design,operation,hardware,sales,consulting,maintenance,research,media,investment,legal,teacher,student,art,other|name=职业领域',
			city: 'must|string|min:2|max:50|name=城市',
			desc: 'must|string|min:10|max:500|name=自我介绍',
			resource: 'string|max:500|name=可分享资源',
			needs: 'string|max:500|name=需求',
			contactList: 'array|name=联系方式',
			forms: 'array|name=表单',
			employmentStatus: 'must|string|in:employed,startup,freelance,seeking,student|name=就业状态',
			status: 'int|default=1'
		};
		console.log('[Register Controller] 接收到的数据:', this._request);
		console.log('[Register Controller] 验证规则:', rules);
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiClient(input);

		let service = new PassportService();
		return await service.register(this._userId, input);
	}

	async editBase() {
		let rules = {
			nickName: 'must|string|min:1|max:30|name=昵称',
			realName: 'must|string|min:2|max:30|name=真实姓名',
			userMobile: 'must|mobile|name=手机',
			userPic: 'must|string|name=头像',
			gender: 'must|string|in:unknown,male,female,other|name=性别',
			profession: 'must|string|in:dev,product,design,operation,hardware,sales,consulting,maintenance,research,media,investment,legal,teacher,student,art,other|name=职业领域',
			city: 'must|string|min:2|max:50|name=城市',
			desc: 'must|string|min:10|max:500|name=自我介绍',
			resource: 'string|max:500|name=可分享资源',
			needs: 'string|max:500|name=需求',
			contactList: 'array|name=联系方式',
			forms: 'array|name=表单',
			employmentStatus: 'must|string|in:employed,startup,freelance,seeking,student|name=就业状态',
		};
		console.log('[Edit Base Controller] 接收到的数据:', this._request);
		console.log('[Edit Base Controller] 验证规则:', rules);
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
		console.log('[Get User Detail Controller] 接收到的数据:', this._request);
		console.log('[Get User Detail Controller] 验证规则:', rules);
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
		console.log('[Edit User Controller] 接收到的数据:', this._request);
		console.log('[Edit User Controller] 验证规则:', rules);
		// 取得数据
		let input = this.validateData(rules);

		let service = new PassportService();
		let result = await service.editUser(input.userId, input.data);

		return result;
	}

	async login() {
		let rules = {};
		console.log('[Login Controller] 接收到的数据:', this._request);
		console.log('[Login Controller] 验证规则:', rules);
		let input = this.validateData(rules);

		let service = new PassportService();
		return await service.login(this._userId);
	}
}

module.exports = PassportController;