const api = require('../../utils/request.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false, //加载是否隐藏
    userInfo: {},
    login_token: '',
    music: {},
    isPlay: false,
    animationLeft: '',
    animationTop: '',
    animationOpacity: '',
    animationTransition: '',
    playlist: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { //接受其他页面传来的数据
    let listId = options.listId
    // let listId = 4895239160
    console.log(options)
    if (Object.keys(this.data.playlist).length == 0)
      this.getPlaylistDetail(listId)
  },
  //获取歌单详情
  getPlaylistDetail(listId) {
    api.get('/playlist/detail?id=' + listId).then(res => {
      this.setData({
        playlist: res.playlist,
        hidden: true
      })
    })
  },
  //播放音乐
  playMusic(e) {
    let id = e.currentTarget.dataset.id
    const music = e.currentTarget.dataset.music;
    app.play(id) //调用全局播放方法
    this.animation(id, music)
  },
  playAll() {
    let playlist = this.data.playlist.tracks
    console.log(playlist);
    let music = playlist.shift()
    app.play(music.id) //调用全局播放方法
    this.animation(music.id, music)
    const playlistId = playlist.map(item => item.id)
    app.globalData.playList.unshift(...playlistId)
  },
  //miniPlayer动画
  animation: function (id, music) {
    const query = wx.createSelectorQuery();
    query.select('.img-num-' + id).boundingClientRect()
    query.exec(res => {
      this.setData({
        "isAnimation": id,
        animationLeft: res[0].left + 'px',
        animationTop: res[0].top + 'px',
        animationOpacity: 1,
        animationTransition: 'left 0s, top 0s',
      })
      setTimeout(() => {
        this.setData({
          animationLeft: app.globalData.ww - 100 + 'px',
          animationTop: app.globalData.hh - 100 + 'px',
          animationOpacity: 0,
          animationTransition: 'left 0.8s linear, top 0.8s ease-in, opacity 1s',
        })
      }, 1);
    })
    setTimeout(() => {
      app.globalData.getTabBar.setData({
        "isPlay": false,
      })
      this.setData({
        "isPlay": true,
        music
      })
      app.globalData.getTabBar.setData({
        "isPlay": true,
        'routerList[2]': {
          "iconPath": music.al.picUrl + '?param=200y200',
          "selectedIconPath": music.al.picUrl + '?param=200y200',
          "pagePath": "/pages/player/player",
          "text": ""
        }
      })
    }, 800);
  },
})