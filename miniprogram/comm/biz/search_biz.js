const BaseBiz = require('./base_biz.js');
const cacheHelper = require('../../helper/cache_helper.js');
class SearchBiz extends BaseBiz {
	
	static clearHistory(key){
		cacheHelper.remove(key);
	}

	static getHistory(key)
	{ 
		return cacheHelper.get(key, []);

	}
	static addHistory(key, val, size = 20, expire = 86400 * 30)  {
		if (!val || val.length == 0) return [];
		
		let his = cacheHelper.get(key, []);
		let pos = his.indexOf(val);	 
		if (pos > -1) his.splice(pos, 1);
		his.unshift(val);
		if (his.length > size)
			his.splice(his.length - 1, 1);
		cacheHelper.set(key, his, expire);

		return his;
	}

}

module.exports = SearchBiz;