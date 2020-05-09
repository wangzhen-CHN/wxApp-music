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
  },
  onLoad: function () {
    wx.setNavigationBarColor ({frontColor:'#000000',backgroundColor:'#f4f5f7'})
    Promise.all([
      api.get('/banner?type=2'),
      api.get('/personalized/newsong'),
      api.get('/top/playlist?limit=7&cat=华语'),
    ]).then(res => {
      res[2].playlists.shift()
      this.setData({
        banners: res[0].banners,
        daySong: res[1].result[0],
        playlists: res[2].playlists
      })
      console.log(res)
    }).catch(e => {
      console.log(e)
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  }
})