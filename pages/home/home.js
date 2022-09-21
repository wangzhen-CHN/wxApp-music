//index.js

const APP = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    showSearch: false,
    isloading: true,
    animationPicUrl: "../../images/logo.png",
    playMusicPicUrl: "",
    playMusicId: "",
    recommends: [],
    recommendList: [],
    hotSearchList: [],
    searchMusicList: [],
    currentSwiper: 0
  },
  onShow: function () {
    // console.log('xxxxxxxxxxx',this.getTabBar())
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
