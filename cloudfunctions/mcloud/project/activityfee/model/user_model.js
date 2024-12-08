const BaseProjectModel = require('./base_project_model.js');
class UserModel extends BaseProjectModel { }
UserModel.CL = BaseProjectModel.C('user');

UserModel.DB_STRUCTURE = {
	_pid: 'string|true',
	USER_ID: 'string|true',

	USER_MINI_OPENID: 'string|true|comment=小程序openid',
	USER_STATUS: 'int|true|default=1|comment=状态 0=待审核,1=正常,8=审核未过,9=禁用',
	USER_CHECK_REASON: 'string|false|comment=审核未过的理由',

	USER_NICK_NAME: 'string|false|comment=用户昵称',
	USER_REAL_NAME: 'string|true|comment=真实姓名',
	USER_MOBILE: 'string|true|comment=联系电话',
	USER_PIC: 'string|false|comment=头像',
	USER_GENDER: 'string|true|default="unknown"|comment=性别',
	USER_PROFESSION: 'string|true|default="other"|comment=职业领域',
	USER_CITY: 'string|true|comment=所在城市',
	USER_DESC: 'string|true|comment=自我介绍',

	USER_EMPLOYMENT_STATUS: 'string|true|default="employed"|comment=就业状态',
	USER_RESOURCE: 'string|false|comment=可分享的资源',
	USER_NEEDS: 'string|false|comment=需求',

	USER_CONTACT_LIST: 'array|true|default=[]|comment=联系方式列表',

	USER_FORMS: 'array|true|default=[]',
	USER_OBJ: 'object|true|default={}',

	USER_LOGIN_CNT: 'int|true|default=0|comment=登陆次数',
	USER_LOGIN_TIME: 'int|false|comment=最近登录时间',

	USER_ADD_TIME: 'int|true',
	USER_ADD_IP: 'string|false',

	USER_EDIT_TIME: 'int|true',
	USER_EDIT_IP: 'string|false',
}
UserModel.FIELD_PREFIX = "USER_";
UserModel.STATUS = {
	UNUSE: 0,
	COMM: 1,
	UNCHECK: 8,
	FORBID: 9
};

UserModel.STATUS_DESC = {
	UNUSE: '待审核',
	COMM: '正常',
	UNCHECK: '未通过审核',
	FORBID: '禁用'
};

module.exports = UserModel;