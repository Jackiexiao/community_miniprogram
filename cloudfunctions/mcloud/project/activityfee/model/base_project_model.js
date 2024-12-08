const BaseModel = require('../../../framework/platform/model/base_model.js');
const dbUtil = require('../../../framework/database/db_util.js');

class BaseProjectModel extends BaseModel {
    static async getOne(where, fields = '*', orderBy = {}) {
        return await dbUtil.getOne(this.CL, where, fields, orderBy);
    }

    static async count(where) {
        return await dbUtil.count(this.CL, where);
    }

    static async del(where) {
        return await dbUtil.del(this.CL, where);
    }

    static async insert(data) {
        return await dbUtil.insert(this.CL, data);
    }
}

module.exports = BaseProjectModel;