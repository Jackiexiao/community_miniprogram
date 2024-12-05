const BaseProjectAdminService = require('./base_project_admin_service.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const setupUtil = require('../../../../framework/utils/setup/setup_util.js');
const config = require('../../../../config/config.js');
const md5Lib = require('../../../../framework/lib/md5_lib.js');

class AdminSetupService extends BaseProjectAdminService {
	async setSetup(key, val, type = '') {
		await setupUtil.set(key, val, type);
	}
	async setContentSetup(key, val, type = '') {
		let oldVal = await setupUtil.get(key);
		if (oldVal)
			await cloudUtil.handlerCloudFilesByRichEditor(oldVal, val);

		await setupUtil.set(key, val, type);
	}
	async genMiniQr(page, sc = 'qr') {
		let cloud = cloudBase.getCloud();

		if (page.startsWith('/')) page = page.substring(1);
		console.log('page=' + page, ', scene=' + sc);

		let result = await cloud.openapi.wxacode.getUnlimited({
			scene: sc,
			width: 280,
			check_path: false,
			page
		});

		let cloudPath = PID + '/' + 'setup/' + md5Lib.md5(page) + '.png';
		let upload = await cloud.uploadFile({
			cloudPath,
			fileContent: result.buffer,
		});

		if (!upload || !upload.fileID) return;

		let ret = await cloudUtil.getTempFileURLOne(upload.fileID);
		return ret + '?rd=' + this._timestamp;
	}

}

module.exports = AdminSetupService;