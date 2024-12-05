const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../../helper/cache_helper.js');
const timeHelper = require('../../helper/time_helper.js');
const pageHelper = require('../../helper/page_helper.js');
const CACHE_FOOT = 'CACHE_FOOT';

class FootBiz extends BaseBiz {

	static getFootList() {
		let foot = cacheHelper.get(CACHE_FOOT);
		if (foot) {
			for (let i = 0; i < foot.length; i++) {
				foot[i].time = timeHelper.timestamp2Time(foot[i].time);
			}
		}

		return foot;
	}
	static addFoot(type, title, size = 60, expire = 86400 * 365 * 3) {
		let path = pageHelper.getCurrentPageUrlWithArgs();
		if (!path || !title || !type) return [];

		let foot = cacheHelper.get(CACHE_FOOT, []);
		for (let k = 0; k < foot.length; k++) {
			if (path == foot[k].path)
				foot.splice(k, 1);
		}
		let val = {
			path,
			type,
			title,
			time: timeHelper.time()
		}
		foot.unshift(val);
		if (foot.length > size)
			foot.splice(foot.length - 1, 1);
		cacheHelper.set(CACHE_FOOT, foot, expire);

		return foot;
	}
}

module.exports = FootBiz;