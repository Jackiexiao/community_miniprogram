const BaseBiz = require('../../../comm/biz/base_biz.js');
const ActivityBiz = require('./activity_biz.js');
const projectSetting = require('../public/project_setting.js');
const formSetHelper = require('../../../cmpts/public/form/form_set_helper.js');
const timeHelper = require('../../../helper/time_helper.js');

class AdminActivityBiz extends BaseBiz {
    static initFormData(id = '') {
        let cateIdOptions = ActivityBiz.getCateList();

        return {
            id,

            cateIdOptions,
            fields: projectSetting.ACTIVITY_FIELDS,

            formTitle: '测试活动标题',
            formCateId: '1',
            formOrder: 9999,

            formMaxCnt: 30,
            formStart: timeHelper.time('Y-M-D h:m'),
            formEnd: timeHelper.time('Y-M-D h:m', 7*86400),
            formStop: timeHelper.time('Y-M-D h:m', 6*86400),

            formMethod: 0,
            formFee: 0,

            formAddress: '湖南省长沙市岳麓区岳麓大道888号',
            formAddressGeo: {
                address: '湖南省长沙市岳麓区岳麓大道888号',
                latitude: 28.228209,
                longitude: 112.938814,
                name: '测试地点'
            },

            formCheckSet: 0,
            formCancelSet: 1,
            formIsMenu: 1,

            formForms: [{
                type: 'text',
                val: '这里是活动详情介绍'
            }, {
                type: 'image',
                val: ['https://images.unsplash.com/photo-1522543558187-768b6df7c25c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80']
            }],

            formActivityObj: {
                cover: [],
                time: 2,
                desc: [{
                    type: 'text',
                    val: '活动详情介绍'
                }],
                img: []
            },

            formJoinForms: [{
                type: 'text',
                title: '姓名',
                desc: '请填写真实姓名',
                must: true,
                len: 10,
                onlySet: {
                    mode: 'all',
                    cnt: -1,
                },
                val: '这里是活动详情介绍',
                sort: 0
            }, {
                type: 'mobile',
                title: '手机号码',
                desc: '请填写手机号码',
                must: true,
                type:'text',
                onlySet: {
                    mode: 'all',
                    cnt: -1
                },
                sort: 1
            }],
        }

    }

    static selectLocation(that) {
        let callback = function (res) {
            if (!res || !res.name || !res.address || !res.latitude || !res.longitude)
                return;

            let formAddress = res.address + '  ' + res.name;

            let formAddressGeo = {};
            formAddressGeo.name = res.name;
            formAddressGeo.address = res.address;
            formAddressGeo.latitude = res.latitude;
            formAddressGeo.longitude = res.longitude;
            that.setData({
                formAddressGeo,
                formAddress
            });
        }
        if (that.data.formAddressGeo && that.data.formAddressGeo.latitude > 0) {
            wx.chooseLocation({
                latitude: that.data.formAddressGeo.latitude,
                longitude: that.data.formAddressGeo.longitude,
                success: function (res) {
                    callback(res);
                }
            })
        } else {
            wx.chooseLocation({
                success: function (res) {
                    callback(res);
                },
                fail: function (err) {
                    console.log(err);
                }
            })
        }
    }
}

AdminActivityBiz.CHECK_FORM = {
    title: 'formTitle|must|string|min:2|max:50|name=标题',
    cateId: 'formCateId|must|id|name=分类',
    cateName: 'formCateId|must|string|name=分类名称',

    maxCnt: 'formMaxCnt|must|int|name=人数上限',
    start: 'formStart|must|string|name=活动开始时间',
    end: 'formEnd|must|string|name=活动结束时间',
    stop: 'formStop|must|string|name=报名截止时间',

    method: 'formMethod|must|int|name=缴费方式',
    fee: 'formFee|must|money|name=缴费金额',

    address: 'formAddress|string|name=活动地点',
    addressGeo: 'formAddressGeo|object|name=活动地点GEO',

    checkSet: 'formCheckSet|must|int|name=审核设置',
    cancelSet: 'formCancelSet|must|int|name=取消设置',
    isMenu: 'formIsMenu|must|int|name=是否展示名单',
    forms: 'formForms|array',
    joinForms: 'formJoinForms|array|name=用户报名资料设置',
};

module.exports = AdminActivityBiz;