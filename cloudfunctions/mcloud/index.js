const application = require('./framework/core/application.js');
exports.main = async (event, context) => {
	return await application.app(event, context);
}