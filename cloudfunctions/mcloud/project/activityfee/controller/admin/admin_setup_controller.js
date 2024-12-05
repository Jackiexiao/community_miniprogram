const BaseProjectAdminController = require('./base_project_admin_controller.js');
const AdminSetupService = require('../../service/admin/admin_setup_service.js');
const contentCheck = require('../../../../framework/validate/content_check.js');

class AdminSetupController extends BaseProjectAdminController {
	async setSetup() {
		await this.isAdmin();
		let rules = {
			key: 'must|string|name=KEY',
			content: 'name=内容',
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminSetupService();
		await service.setSetup(input.key, input.content);
	}
	async setContentSetup() {
		await this.isAdmin();
		let rules = {
			id: 'must|string|name=KEY',
			content: 'must|array|name=内容'
		};
		let input = this.validateData(rules);
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminSetupService();
		await service.setContentSetup(input.id, input.content, 'content');
	}

	async genMiniQr() {
		await this.isAdmin();
		let rules = {
			path: 'must|string',
			sc: 'string',
		};
		let input = this.validateData(rules);


		let service = new AdminSetupService();
		return await service.genMiniQr(input.path, input.sc);
	}
}

module.exports = AdminSetupController;