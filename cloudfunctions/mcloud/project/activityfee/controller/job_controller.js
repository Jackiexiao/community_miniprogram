const BaseProjectController = require('./base_project_controller.js');
const ActivityService = require('../service/activity_service.js');

class JobController extends BaseProjectController {
	minuteJob() {
		console.log('DO minuteJob Begin...')

		let service = new ActivityService();
		service.minuteJob();

		console.log('DO minuteJob END.')
	}
}

module.exports = JobController;