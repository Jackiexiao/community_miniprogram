const BaseProjectModel = require('./base_project_model.js');

class ActivityModel extends BaseProjectModel {

}
ActivityModel.CL = BaseProjectModel.C('activity');

ActivityModel.DB_STRUCTURE = {
    _pid: 'string|true',
    ACTIVITY_ID: 'string|true',

    ACTIVITY_TITLE: 'string|true|comment=标题',
    ACTIVITY_STATUS: 'int|true|default=1|comment=状态 0=未启用,1=使用中',

    ACTIVITY_CATE_ID: 'string|true|comment=分类ID',
    ACTIVITY_CATE_NAME: 'string|true|comment=分类名称',

    ACTIVITY_CANCEL_SET: 'int|true|comment=取消设置',
    ACTIVITY_CHECK_SET: 'int|true|comment=审核',
    ACTIVITY_IS_MENU: 'int|true|comment=是否公开展示名单',

    ACTIVITY_MAX_CNT: 'int|true|comment=人数上限',
    ACTIVITY_START: 'int|true|comment=开始时间',
	ACTIVITY_END: 'int|true|comment=截止时间',
	ACTIVITY_START_DAY: 'string|false|comment=开始时间',
    ACTIVITY_END_DAY: 'string|false|comment=截止时间',
	ACTIVITY_STOP: 'int|true|comment=报名截止时间',

	ACTIVITY_START_MONTH: 'string|false|comment=开始月份',
	ACTIVITY_END_MONTH: 'string|false|comment=截止月份',

    ACTIVITY_ORDER: 'int|true|comment=排序号',
    ACTIVITY_VOUCH: 'int|true|default=0',

    ACTIVITY_FORMS: 'array|false|comment=表单设置',
    ACTIVITY_OBJ: 'object|true|default={}|comment=活动对象',

    ACTIVITY_JOIN_FORMS: 'array|false|comment=报名表单设置',

    ACTIVITY_ADDRESS: 'string|false|comment=地址',
    ACTIVITY_ADDRESS_GEO: 'object|false|comment=地理位置',

    ACTIVITY_QR: 'string|false',
    ACTIVITY_VIEW_CNT: 'int|true|default=0',
    ACTIVITY_COMMENT_CNT: 'int|true|default=0',

    ACTIVITY_METHOD: 'int|true|comment=支付方式',
    ACTIVITY_FEE: 'int|true|comment=费用(分)',

    ACTIVITY_JOIN_CNT: 'int|true|default=0',
    ACTIVITY_PAY_CNT: 'int|true|default=0|comment=支付数',
    ACTIVITY_PAY_FEE: 'int|true|default=0|comment=支付额',

    ACTIVITY_USER_LIST: 'array|true|default=[]|comment={name,id,pic}',

    ACTIVITY_ADD_TIME: 'int|true',
    ACTIVITY_EDIT_TIME: 'int|true',
    ACTIVITY_ADD_IP: 'string|false',
    ACTIVITY_EDIT_IP: 'string|false',
};
ActivityModel.FIELD_PREFIX = "ACTIVITY_";
ActivityModel.STATUS = {
    UNUSE: 0,
    COMM: 1
};



module.exports = ActivityModel;