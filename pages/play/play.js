//index.js
//获取应用实例
const api = require('../../utils/request.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    banners: [],
    playlists: [],
    daySong: {},
    currentSwiper: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  back: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  onLoad: function () {
    wx.setNavigationBarColor ({frontColor:'#000000',backgroundColor:'#ffffff'})
  },
})