const MultiModel = require('../../database/multi_model.js');

class SetupModel extends MultiModel {

}
SetupModel.CL = MultiModel.C('setup');

SetupModel.DB_STRUCTURE = {
	_pid: 'string|true',
	SETUP_ID: 'string|true',

	SETUP_TYPE: 'string|false', //content/cache/vouch
	SETUP_KEY: 'string|true',
	SETUP_VALUE: 'object|true', // {val:}
 
	SETUP_ADD_TIME: 'int|true',
	SETUP_EDIT_TIME: 'int|true',
	SETUP_ADD_IP: 'string|false',
	SETUP_EDIT_IP: 'string|false',
};
SetupModel.FIELD_PREFIX = "SETUP_"; 


module.exports = SetupModel;

/* 
[{"type":"text","val":"xxx"},{"type":"img","val":"cloudId://xxxx"}]
{"EXPORT_CLOUD_ID":"","EXPORT_EDIT_TIME":""}
*/