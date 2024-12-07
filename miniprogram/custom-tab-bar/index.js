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
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({
        url
      });
      this.setData({
        selected: data.index
      });
    }
  }
});
