const pageHelper = require('../../../helper/page_helper.js');
const contentCheckHelper = require('../../../helper/content_check_helper.js');
const setting = require('../../../setting/setting.js');

Component({
	properties: {
		imgList: {
			type: Array,
			value: []

		},
		imgMax: {
			type: Number,
			value: 4,
		},
		title: {
			type: String,
			value: '图片上传',
		},
		must: { //是否必填
			type: Boolean,
			value: true,
		},
		isCheck: { //是否做图片内容校验
			type: Boolean,
			value: true,
		},
		isShowNo: { //是否显示序号
			type: Boolean,
			value: false,
		},
		imgUploadSize: { //图片最大大小
			type: Number,
			value: setting.IMG_UPLOAD_SIZE,
		},
		isShowSize: { //是否提示图片尺寸
			type: Boolean,
			value: true,
		}
	},
	data: {
	},
	lifetimes: {
		attached: function () {

		},

		ready: function () {

		},
		detached: function () {
		},
	},
	methods: {
		bindChooseImgTap: function (e) {
			wx.chooseMedia({
				count: this.data.imgMax - this.data.imgList.length, //默认9
				mediaType: ['image'],
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: async (res) => {
					wx.showLoading({
						title: '图片校验中',
						mask: true
					});

					for (let k = 0; k < res.tempFiles.length; k++) {
						let size = res.tempFiles[k].size;
						let path = res.tempFiles[k].tempFilePath;
						if (!contentCheckHelper.imgTypeCheck(path)) {
							wx.hideLoading();
							return pageHelper.showNoneToast('只能上传png、jpg、jpeg格式', 3000);
						}

						let imageMaxSize = 1024 * 1000 * this.data.imgUploadSize;
						if (!contentCheckHelper.imgSizeCheck(size, imageMaxSize)) {
							wx.hideLoading();
							return pageHelper.showNoneToast('单张图片大小不能超过 ' + this.data.imgUploadSize + 'M', 3000);
						}

						if (this.data.isCheck) {
							let check = await contentCheckHelper.imgCheck(path);
							if (!check) {
								wx.hideLoading();
								return pageHelper.showNoneToast('存在不合适的图片, 已屏蔽', 3000);
							}
						}


						this.setData({
							imgList: this.data.imgList.concat(path)
						});
						this.triggerEvent('upload', this.data.imgList);

					}

					wx.hideLoading();
				}
			});
		},

		bindPreviewImgTap: function (e) {
			wx.previewImage({
				urls: this.data.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		catchDelImgTap: function (e) {
			let that = this;
			let callback = function () {
				that.data.imgList.splice(e.currentTarget.dataset.index, 1);
				that.setData({
					imgList: that.data.imgList
				});
				that.triggerEvent('upload', that.data.imgList);
			}
			pageHelper.showConfirm('确定要删除该图片吗？', callback);
		},

	}
})