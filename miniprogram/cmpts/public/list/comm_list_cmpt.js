const cloudHelper = require('../../../helper/cloud_helper.js');
const helper = require('../../../helper/helper.js');
const PublicBiz = require('../../../comm/biz/public_biz.js');
const pageHelper = require('../../../helper/page_helper.js');

Component({
	options: {
		addGlobalClass: true,
		pureDataPattern: /^_dataList/, // 指定所有 _ 开头的数据字段为纯数据字段
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	properties: {
		doDate: {
			type: Boolean,
			value: false
		},
		listHeight: { // 列表区高度
			type: String,
			value: ''
		},

		route: { // 业务路由
			type: String,
			value: ''
		},

		source: { // 来源 admin/user
			type: String,
			value: 'user'
		},

		_params: { // 路由的附加参数
			type: Object,
			value: null,
			observer: function (newVal, oldVal) { //TODO????
				if (!oldVal || !newVal) return; //页面data里赋值会引起触发，除非在组件标签里直接赋值,或者提前赋值
				if (newVal) {
					this.setData({
						pulldownMaskShow: false //返回去遮罩
					});
					this._fmtSearchData();
				}

				this.data._dataList = null;
				this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model 
					dataList: this.data._dataList
				});
				this._getList(1);
			}
		},
		isTotalMenu: {
			type: Boolean, //是否整个搜索菜单显示
			value: true
		},
		_items: { // 下拉菜单基础数据
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {
				if (newVal) this._fmtSearchData();
			}
		},
		_menus: { // 非下拉菜单基础数据 
			type: Array,
			value: [],
			observer: function (newVal, oldVal) {
				if (newVal) this._fmtSearchData(); //置为纯数据字段则不触发
			}
		},
		_dataList: {
			type: Object,
			value: null
		},
		type: {
			type: String, //业务类型 info,user,well
			value: ''
		},
		placeholder: {
			type: String,
			value: '搜索关键字'
		},
		sortMenusDefaultIndex: {
			type: Number,
			value: -1 //横菜单默认选中的
		},
		search: {
			type: String, //搜索框关键字
			value: '',
			observer: function (newVal, oldVal) {
				if (newVal) {
					this.setData({
						pulldownMaskShow: false //返回去遮罩
					});
					this._fmtSearchData();
				}

				this.data._dataList = null;
				this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model 
					dataList: this.data._dataList
				});
				this._getList(1);
			}
		},
		whereEx: {
			type: Object, // 附加查询条件
			value: null,
		},
		returnUrl: {
			type: String, // 搜索完返回页面
			value: '',
		},
		topBottom: {
			type: String, // 回顶部按钮的位置
			value: '50'
		},
		isCache: { // 非缓存状态下或者list缓存过期下onshow加载, 缓存下onload加载
			type: Boolean, //是否cache
			value: true
		},
		pulldownType: {
			type: Array, // 下拉菜单展示模式 list/modal 每个菜单一个
			value: ['list', 'list', 'list', 'list', 'list', 'list']
		},

		startDate: {
			type: String,
			value: ''
		},
		endDate: {
			type: String,
			value: ''
		},

	},
	data: {
		refresherTriggered: false, //下拉刷新是否完成

		sortItems: [], //下拉
		sortMenus: [], //一级菜单非下拉

		sortType: '', //回传的类型
		sortVal: '', //	回传的值

		sortItemIndex: -1,
		sortIndex: -1,

		topNum: 0, //回顶部
		topShow: false,

		pulldownMaskShow: false, //下拉菜单遮罩

	},

	lifetimes: {
		created: function () {
		},
		attached: function () {
		},
		ready: async function () {
			this._fmtSearchData();

			if (this.data.isCache) //缓存状态下加载
				await this._getList(1);
			let params = this.data._params;
			if (params && params.sortType && helper.isDefined(params.sortVal)) { 
				let sortMenus = this.data._menus;
				for (let k = 0; k < sortMenus.length; k++) {
					if (params.sortType == sortMenus[k].type && params.sortVal == sortMenus[k].value) {
						this.setData({
							sortMenusDefaultIndex: k
						});
						break;
					} 
				}
			}

		},
		move: function () {
		},
		detached: function () {
		},
	},

	pageLifetimes: {
		async show() {
			if (!this.data.isCache || !PublicBiz.isCacheList(this.data.type)) {
				await this._getList(1);
			}

		},
		hide() {
		},
		resize(size) {
		}
	},
	methods: {
		reload: async function () {
			await this._getList(1);
		},
		_getList: async function (page) {
			let params = {
				page: page,
				...this.data._params
			};
			if (this.data.whereEx) params.whereEx = this.data.whereEx;
			if (this.data.search)
				params.search = this.data.search;
			if (this.data.doDate && this.data.startDate && this.data.endDate) {
				params.search = this.data.startDate + '#' + this.data.endDate; 
			}
			if (this.data.sortType && helper.isDefined(this.data.sortVal)) {
				params.sortType = this.data.sortType;
				params.sortVal = this.data.sortVal;
			}
			if (page == 1) {
				this.triggerEvent('list', {
					dataList: null //第一页面且没有数据提示加载中
				});
			}


			let opt = {};
			opt.title = 'bar';
			await cloudHelper.dataList(this, '_dataList', this.data.route, params, opt);

			this.triggerEvent('list', { //TODO 考虑改为双向数据绑定model
				sortType: this.data.sortType,
				dataList: this.data._dataList
			});

			if (this.data.isCache)
				PublicBiz.setCacheList(this.data.type);
			if (page == 1) this.bindTopTap();


		},

		bindReachBottom: function () {
			this._getList(this.data._dataList.page + 1);
		},

		bindPullDownRefresh: async function () {
			this.setData({
				refresherTriggered: true
			});
			await this._getList(1);
			this.setData({
				refresherTriggered: false
			});

		},
		bindScrollTop: function (e) {
			if (e.detail.scrollTop > 100) {
				this.setData({
					topShow: true
				});
			} else {
				this.setData({
					topShow: false
				});
			}
		},
		bindTopTap: function () {
			this.setData({
				topNum: 0
			});
		},
		_fmtSearchData: function () {
			let data = {};
			let sortItems = [];
			let items = this.data._items;
			for (let k = 0; k < items.length; k++) {
				let item = {
					show: false,
					items: items[k]
				};
				sortItems.push(item);
			}
			data.sortItems = sortItems;
			data.sortMenus = this.data._menus;

			data.sortItemIndex = -1;
			data.sortIndex = -1;

			data.sortType = '';
			data.sortVal = '';
			this.setData(data);

		},
		bindSearchClearTap: function () {
			if (this.data.search) {
				this.triggerEvent('list', {
					search: ''
				});
			}
		},
		bindSortTap: function (e) {
			let sortIndex = e.currentTarget.dataset.index;
			let sortItems = this.data.sortItems;
			/*
			this.setData({
				sortMenusDefaultIndex: -1
			});*/
			let sortItemIndex = (sortIndex != this.data.sortIndex) ? -1 : this.data.sortItemIndex;

			if (sortIndex < 5) {
				let pulldownMaskShow = this.data.pulldownMaskShow;
				for (let i = 0; i < sortItems.length; i++) {
					if (i != sortIndex)
						sortItems[i].show = false;
					else {
						sortItems[i].show = !sortItems[i].show;
						pulldownMaskShow = sortItems[i].show;
					}

				}
				this.setData({
					pulldownMaskShow, //遮罩

					sortItems,
					sortIndex,
					sortItemIndex
				});
			} else {
				for (let i = 0; i < sortItems.length; i++) {
					sortItems[i].show = false;
				}
				this.setData({
					pulldownMaskShow: false,
					sortItems,
					sortIndex,
					sortItemIndex
				});

				this._getSortKey();
			}
		},
		bindSortItemTap: function (e) {
			let sortItemIndex = e.target.dataset.idx;
			if (!sortItemIndex) sortItemIndex = 0; // #46
			let sortItems = this.data.sortItems;
			for (let i = 0; i < sortItems.length; i++) {
				sortItems[i].show = false;
			}
			this.setData({
				pulldownMaskShow: false,
				sortItemIndex,
				sortItems
			});
			this._getSortKey();

		},
		_getSortKey: function () {
			let sortVal = '';
			let sortType = '';

			let oldSortVal = this.data.sortVal;
			let oldSortType = this.data.sortType;

			if (this.data.sortIndex < 5) {
				sortVal = this.data.sortItems[this.data.sortIndex].items[this.data.sortItemIndex].value;
				sortType = this.data.sortItems[this.data.sortIndex].items[this.data.sortItemIndex].type;
			} else {
				sortVal = this.data.sortMenus[this.data.sortIndex - 5].value;
				sortType = this.data.sortMenus[this.data.sortIndex - 5].type;
			}
			this.setData({
				sortVal,
				sortType
			});

			if (sortVal != oldSortVal || sortType != oldSortType) {

				if (this.data.startDate || this.data.endDate) {
					this.setData({
						startDate: '',
						endDate: ''
					});
				}
				if (this.data.search) {
					this.triggerEvent('list', {
						search: ''
					});
				} else
					this._getList(1);

			}

		},
		bindSearchTap: function (e) {
			wx.navigateTo({
				url: pageHelper.fmtURLByPID('/pages/search/search?source=' + this.data.source + '&type=' + this.data.type + '&returnUrl=' + this.data.returnUrl)
			});
		},

		getSortIndex: function () { //获得横向菜单
			return this.data.sortIndex;
		},
		setSortIndex: function (sortIndex) { //设置横向菜单
			this.setData({
				sortIndex
			});
		},

		bindDateStartChange(e) {
			this.setData({
				startDate: e.detail.value,
			});
		},
		bindDateEndChange(e) {
			this.setData({
				endDate: e.detail.value,
			});
		},
		bindDateSearchTap: function (e) {
			if (!this.data.startDate.includes('-')) return pageHelper.showNoneToast('请选择开始日期');
			if (!this.data.endDate.includes('-')) return pageHelper.showNoneToast('请选择结束日期');

			let search = this.data.startDate + '#' + this.data.endDate;
			this.setData({
				search
			})
			this._getList(1);
		},
		bindDateClearTap: function (e) {
			this.setData({
				startDate: '',
				endDate: '',
			});
			if (this.data.search) {
				this.setData({
					search: ''
				});
			}

		}

	}
})