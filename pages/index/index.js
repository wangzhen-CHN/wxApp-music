//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    banners: [
      {url: '../../images/banner01.jpg'},
      {url: '../../images/banner02.jpg'},
      {url: '../../images/banner03.jpg'},
      {url: '../../images/banner04.jpg'},
      {url: '../../images/banner05.jpg'}
    ],
    currentSwiper:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.setNavigationBarColor ({frontColor:'#ffffff',backgroundColor:'#3341d5'})
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  }
})
