//index.js

const APP = getApp()
Page({
  data: {
    isloading: true,
    noScroll:false,
    currentSwiper: 0
  },
  onSearchPopupShow: function (value) {
      this.setData({noScroll:value.detail})
  },
  onShow: function () {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      APP.globalData.getTabBar = this.getTabBar()
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  onLoad: function () {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      APP.globalData.getTabBar = this.getTabBar()
      this.getTabBar().setData({
        selected: 0
      })
    }
    wx.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#fff"
    })
  },

})
