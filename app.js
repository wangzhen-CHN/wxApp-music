App({
  globalData: {
    PLAYER: {}
  },
  onLaunch: function () {
    wx.getSystemInfo({ //  获取页面的有关信息
      success: res=> {
        wx.setStorageSync('systemInfo', res)
        this.globalData.ww = res.windowWidth;
        this.globalData.hh = res.windowHeight;
      }
    });
  },
})