const BaseProjectModel = require('./base_project_model.js');

class CommentModel extends BaseProjectModel {

}
CommentModel.CL = BaseProjectModel.C('comment');

CommentModel.DB_STRUCTURE = {
	_pid: 'string|true',

	COMMENT_ID: 'string|true',

	COMMENT_USER_ID: 'string|true|comment=用户ID',

	COMMENT_TYPE: 'string|true',
	COMMENT_OID: 'string|true', 
	
	COMMENT_FORMS: 'array|true|default=[]',
	COMMENT_OBJ: 'object|true|default={}',

	COMMENT_ADD_TIME: 'int|true',
	COMMENT_EDIT_TIME: 'int|true',
	COMMENT_ADD_IP: 'string|false',
	COMMENT_EDIT_IP: 'string|false',

};
CommentModel.FIELD_PREFIX = "COMMENT_";

module.exports = CommentModel;