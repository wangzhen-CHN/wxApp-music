Page({
  data: {
    isLogin:false,
    logs: []
  },
  onLoad: function () {
    // wx.setNavigationBarColor({
    //   frontColor: '#000000',
    //   backgroundColor: '#222'
    // })
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
  }
})