const BaseProjectController = require('./base_project_controller.js');
const HomeService = require('../service/home_service.js');

class HomeController extends BaseProjectController {

	async getSetup() {
		let rules = {
			key: 'must|string|name=KEY',
		};
		let input = this.validateData(rules);

		let service = new HomeService();
		return await service.getSetup(input.key);

	}
	async getHomeList() {
		let service = new HomeService();
		return await service.getHomeList(); 
	}

}

module.exports = HomeController;