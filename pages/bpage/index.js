const api = require('../../utils/request.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isloading: true, //加载是否隐藏
    userInfo: {},
    login_token: '',
    music: {},
    isPlaying: false,
    animationLeft: '',
    animationPicUrl: '',
    animationTop: '',
    animationOpacity: '',
    animationTransition: '',
    playlist: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接受其他页面传来的数据
    console.log(options)
    wx.getSystemInfo({
      success: (res) => {
        wx.setStorageSync('systemInfo', res)
        this.setData({
          height: res.statusBarHeight || 44
        })
      }
    })
    this.getPlaylistDetail('3233164347')
  },
  goBack() {
    wx.navigateBack()
  },
  //获取歌单详情
  getPlaylistDetail(listId) {
    api.get('/playlist/detail?id=' + listId).then((res) => {
      console.log(res.playlist)
      this.setData({
        playlist: res.playlist,
        isloading: false
      })
      setTimeout(() => {
        this.setData({
          isloading: false
        })
      }, 100)
    })
  }
})
