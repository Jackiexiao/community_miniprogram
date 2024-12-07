const setting = require('./setting/setting.js');

App({
  onLaunch: function (options) {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: setting.CLOUD_ID,
        traceUser: true,
      })
    }

    this.globalData = {
      selectedTabIndex: 0
    };
    
    wx.getSystemInfo({
      success: e => {
        this.globalData.statusBarHeight = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) { 
          this.globalData.customBarHeight = capsule.bottom + capsule.top - e.statusBarHeight;
          this.globalData.capsule = capsule;
        } else {
          this.globalData.customBarHeight = e.statusBarHeight + 50;
        } 
      }
    });
  }, 
})