const AppError = require('../../core/app_error.js');
const appCode = require('../../core/app_code.js');
const timeUtil = require('../../utils/time_util.js');

class BaseService {
	constructor() {
		this._timestamp = timeUtil.time();

	}
	AppError(msg, code = appCode.LOGIC) {
		throw new AppError(msg, code);
	}
	fmtSearchDate(where, search, field) {
		if (!search || search.length != 21 || !search.includes('#')) return where;

		let arr = search.split('#');
		let start = arr[0];
		let end = arr[1];
		where[field] = ['between', start, end];
		return where;
	}

	/* 数据库字段排序处理 */
	fmtOrderBySort(sortVal, defaultSort) {
		let orderBy = {
			[defaultSort]: 'desc'
		};

		if (sortVal.includes('|')) {
			let field = sortVal.split('|')[0];
			let order = sortVal.split('|')[1];
			orderBy = {
				[field]: order,
			};
			if (defaultSort != field) orderBy[defaultSort] = 'desc';
		}
		return orderBy;
	}

}

module.exports = BaseService;