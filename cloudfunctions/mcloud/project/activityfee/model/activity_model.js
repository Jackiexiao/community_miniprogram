const BaseProjectModel = require('./base_project_model.js');

class ActivityModel extends BaseProjectModel {
    static clearCreateData(data) {
        console.log('[ActivityModel.clearCreateData] >>>>>>> Begin');
        console.log('[ActivityModel.clearCreateData] Class name:', this.name);
        console.log('[ActivityModel.clearCreateData] Collection:', this.CL);
        console.log('[ActivityModel.clearCreateData] DB_STRUCTURE:', this.DB_STRUCTURE);
        console.log('[ActivityModel.clearCreateData] Input data:', data);
        console.log('[ActivityModel.clearCreateData] Before:', data);
        let ret = super.clearCreateData(data);
        console.log('[ActivityModel.clearCreateData] After:', ret);
        console.log('[ActivityModel.clearCreateData] Output data:', ret);
        console.log('[ActivityModel.clearCreateData] <<<<<<<< End');
        return ret;
    }
}
ActivityModel.CL = BaseProjectModel.C('activity');

ActivityModel.DB_STRUCTURE = {
    _pid: 'string|true|default=0',
    ACTIVITY_ID: 'string|true|default=0',

    ACTIVITY_TITLE: 'string|true|default=未命名|comment=标题',
    ACTIVITY_STATUS: 'int|true|default=1|comment=状态 0=未启用,1=使用中',

    ACTIVITY_CATE_ID: 'string|true|default=0|comment=分类ID',
    ACTIVITY_CATE_NAME: 'string|true|default=未分类|comment=分类名称',

    ACTIVITY_CANCEL_SET: 'int|true|default=1|comment=取消设置 0=不可取消,1=随时可取消,2=报名截止前可取消',
    ACTIVITY_CHECK_SET: 'int|true|default=0|comment=审核 0=不需要审核,1=需要审核',
    ACTIVITY_IS_MENU: 'int|true|default=0|comment=是否公开展示名单 0=不公开,1=公开',

    ACTIVITY_MAX_CNT: 'int|true|default=0|comment=人数上限 0=不限',
    ACTIVITY_START: 'int|true|default=0|comment=开始时间',
    ACTIVITY_END: 'int|true|default=0|comment=截止时间',
    ACTIVITY_START_DAY: 'string|false|comment=开始时间',
    ACTIVITY_END_DAY: 'string|false|comment=截止时间',
    ACTIVITY_STOP: 'int|true|default=0|comment=报名截止时间',

    ACTIVITY_START_MONTH: 'string|false|comment=开始月份',
    ACTIVITY_END_MONTH: 'string|false|comment=截止月份',

    ACTIVITY_ORDER: 'int|true|default=9999|comment=排序号',
    ACTIVITY_VOUCH: 'int|true|default=0',

    ACTIVITY_FORMS: 'array|false|comment=表单设置',
    ACTIVITY_OBJ: 'object|true|default={}|comment=活动对象',

    ACTIVITY_JOIN_FORMS: 'array|false|comment=报名表单设置',

    ACTIVITY_ADDRESS: 'string|false|comment=地址',
    ACTIVITY_ADDRESS_GEO: 'object|false|comment=地理位置',

    ACTIVITY_QR: 'string|false',
    ACTIVITY_VIEW_CNT: 'int|true|default=0',
    ACTIVITY_COMMENT_CNT: 'int|true|default=0',

    ACTIVITY_METHOD: 'int|true|default=0|comment=支付方式 0=免费,1=付费',
    ACTIVITY_FEE: 'int|true|default=0|comment=费用(分)',

    ACTIVITY_JOIN_CNT: 'int|true|default=0',
    ACTIVITY_PAY_CNT: 'int|true|default=0|comment=支付数',
    ACTIVITY_PAY_FEE: 'int|true|default=0|comment=支付额',

    ACTIVITY_USER_LIST: 'array|true|default=[]|comment={name,id,pic}',

    ACTIVITY_ADD_TIME: 'int|true|default=0',
    ACTIVITY_EDIT_TIME: 'int|true|default=0',
    ACTIVITY_ADD_IP: 'string|false',
    ACTIVITY_EDIT_IP: 'string|false',
};
ActivityModel.FIELD_PREFIX = "ACTIVITY_";
ActivityModel.STATUS = {
    UNUSE: 0,
    COMM: 1
};



module.exports = ActivityModel;