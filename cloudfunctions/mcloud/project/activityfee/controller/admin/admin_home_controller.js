const BaseProjectAdminController = require('./base_project_admin_controller.js');
const AdminHomeService = require('../../service/admin/admin_home_service.js');

class AdminHomeController extends BaseProjectAdminController {
	async adminHome() {
		await this.isAdmin();
		let rules = {

		};
		let input = this.validateData(rules);

		let service = new AdminHomeService();
		return await service.adminHome();
	}
	async clearVouchData() {
		await this.isAdmin();
		let rules = {

		};
		let input = this.validateData(rules);

		let service = new AdminHomeService();
		return await service.clearVouchData();
	}

}

module.exports = AdminHomeController;