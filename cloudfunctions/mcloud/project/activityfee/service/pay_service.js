const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const cloudBase = require('../../../framework/cloud/cloud_base.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const ActivityModel = require('../model/activity_model.js');
const ActivityJoinModel = require('../model/activity_join_model.js');

class PayService extends BaseProjectService {
    async createPay(userId, activityJoinId, activityId, fee) {
        try {
            const cloud = cloudBase.getCloud();

            let orderNo = dataUtil.genRandomString(32); // 生成订单号

            let data = {
                type: 'activity',
                orderNo,
                activityJoinId,
                activityId,
                userId,
                fee,
                status: 0, // 未支付
                createTime: timeUtil.time(),
            }

            // 调用云支付
            const res = await cloud.cloudPay.unifiedOrder({
                body: '活动报名费用',
                outTradeNo: orderNo,
                totalFee: fee,
                envId: cloud.config.env,
                functionName: 'pay_notify',
            });

            // 返回支付数据
            return {
                orderNo,
                payment: res,
            };

        } catch (err) {
            console.error('[Pay Service create error]', err);
            throw new Error('支付创建失败，请重试');
        }
    }

    // 支付回调处理
    async payNotify(notifyData) {
        console.log('支付回调数据', notifyData);
        // TODO: 处理支付回调逻辑
    }

    // 退款处理
    async refund(orderNo, refundFee) {
        try {
            const cloud = cloudBase.getCloud();
            
            const res = await cloud.cloudPay.refund({
                out_trade_no: orderNo,
                out_refund_no: dataUtil.genRandomString(32),
                total_fee: refundFee,
                refund_fee: refundFee,
            });

            return res;
        } catch (err) {
            console.error('[Pay Service refund error]', err);
            throw new Error('退款失败，请重试');
        }
    }
}

module.exports = PayService;
