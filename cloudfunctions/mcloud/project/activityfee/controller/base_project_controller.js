const BaseController = require('../../../framework/platform/controller/base_controller.js');
const BaseProjectService = require('../service/base_project_service.js');

class BaseProjectController extends BaseController {
	async initSetup() {
		let service = new BaseProjectService();
		await service.initSetup();
	}
}

module.exports = BaseProjectController;