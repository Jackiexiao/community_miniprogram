const BaseProjectController = require('./base_project_controller.js');
const contentCheck = require('../../framework/validate/content_check.js');

class CheckController extends BaseProjectController {
	async checkImg() {
		let rules = {
			img: 'name=img',
			mine: 'must|default=jpg',
		};
		let input = this.validateData(rules);

		return await contentCheck.checkImg(input.img, 'jpg');

	}

}

module.exports = CheckController;