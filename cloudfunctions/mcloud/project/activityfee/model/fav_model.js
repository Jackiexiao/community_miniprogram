const BaseProjectModel = require('./base_project_model.js');

class FavModel extends BaseProjectModel {
    static async count(where) {
        return await super.count(where);
    }

    static async del(where) {
        return await super.del(where);
    }

    static async insert(data) {
        return await super.insert(data);
    }

    static async getOne(where, fields = '*', orderBy = {}) {
        return await super.getOne(where, fields, orderBy);
    }
}

FavModel.CL = BaseProjectModel.C('fav');

FavModel.DB_STRUCTURE = {
    _pid: 'string|true',
    USER_ID: 'string|true|comment=用户ID',
    CARD_ID: 'string|true|comment=名片ID',
    ADD_TIME: 'int|true|comment=添加时间',
    EDIT_TIME: 'int|true|comment=修改时间',
    ADD_IP: 'string|false|comment=添加IP',
    EDIT_IP: 'string|false|comment=修改IP'
};

FavModel.FIELD_PREFIX = '';
FavModel.UPDATE_TIME = true;
FavModel.UPDATE_IP = true;
FavModel.ADD_ID = false;

module.exports = FavModel;