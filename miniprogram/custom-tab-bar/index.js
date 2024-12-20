Component({
  data: {
    selected: 0,
    list: [{
      pagePath: "/projects/activityfee/pages/activity/index/activity_index",
      text: "活动"
    }, {
      pagePath: "/projects/activityfee/pages/card/index/card_index",
      text: "名片夹"
    }, {
      pagePath: "/projects/activityfee/pages/my/index/my_index",
      text: "我的"
    }]
  },

  lifetimes: {
    attached() {
      this.init();
    }
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      const index = data.index;
      
      this.setData({ selected: index });
      
      wx.switchTab({
        url,
        fail: (error) => {
          console.error('[TabBar] Switch tab failed:', error);
        }
      });
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? '/' + page.route : '';
      
      const index = this.data.list.findIndex(item => item.pagePath === route);
      
      if (index > -1) {
        this.setData({ selected: index });
      }
    }
  }
});
