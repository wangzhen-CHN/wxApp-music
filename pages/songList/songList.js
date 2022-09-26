const api = require('../../utils/request.js')
const app = getApp();
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
  onLoad: function (options) { //接受其他页面传来的数据
    console.log(options)
    this.setData({
      height: app.globalData.statusBarHeight
    })
    const listId = options.listId
    const type = options.type || ''
    console.log(type)
    if (type === 'album') {
      this.getAlbumDetail(listId)
    } else {
      this.getPlaylistDetail(listId)
    }
    // if (Object.keys(this.data.playlist).length == 0)
    //   this.getPlaylistDetail(listId)
  },
  goBack(){
    wx.navigateBack()
  },
  //获取歌单详情
  getPlaylistDetail(listId) {
    api.get('/playlist/detail?id=' + listId).then(res => {
      console.log(res.playlist)
      this.setData({
        playlist: res.playlist,
        isloading: false
      })
      setTimeout(() => {
        this.setData({
          isloading: false
        })
      }, 100);
    })
  },
  //获取专辑详情
  getAlbumDetail(listId) {
    api.get('/album?id=' + listId).then(res => {
      console.log(res)
      this.setData({
        playlist: {
          'coverImgUrl': res.album.blurPicUrl,
          'name': res.album.name,
          'description': res.album.description,
          'creator': {
            'nickname': "青梅竹马的志田黑羽酱"
          },
          'tracks': res.songs
        },
        isloading: false
      })
      setTimeout(() => {
        this.setData({
          isloading: false
        })
      }, 100);
    })
  },
  //播放音乐
  playMusic(e) {
    let id = e.currentTarget.dataset.id
    const music = e.currentTarget.dataset.music;
    app.play(id).then(res=>{
      this.animation(id, music)
    }) //调用全局播放方法
    
  },
  playAll() {
    let playlist = this.data.playlist.tracks
    const playlistId = playlist.map(item => item.id)
    app.play(playlistId[0]).then(res=>{
      this.animation(playlistId[0], playlist[0])
      app.globalData.playList = playlistId
      console.log('存入全局idList',app.globalData.playList)
    }) //调用全局播放方法
  },
  //miniPlayer动画
  animation: function (id, music) {
    const query = wx.createSelectorQuery();
    query.select('.img-num-' + id).boundingClientRect()
    query.exec(res => {
      this.setData({
        isAnimation: true,
        animationPicUrl: music.al.picUrl,
        animationLeft: res[0].left + 'px',
        animationTop: res[0].top + 'px',
        animationOpacity: 1,
        animationTransition: 'left 0s, top 0s',
      })
      // setTimeout(() => {
        this.setData({
          animationLeft: app.globalData.ww - 100 + 'px',
          animationTop: app.globalData.hh - 20 + 'px',
          animationOpacity: 0,
          animationTransition: 'left 0.8s linear, top 0.8s ease-in, opacity 1s',
        })
      // }, 100);
      app.globalData.getTabBar.setData({
        "isPlaying": false,
      })
      this.setData({
        "isPlaying": true,
        music
      })
      app.globalData.getTabBar.setData({
        "isPlaying": true,
        'routerList[2]': {
          "iconPath": music.al.picUrl + '?param=200y200',
          "selectedIconPath": music.al.picUrl + '?param=200y200',
          "pagePath": "/pages/player/player",
          "text": ""
        }
      })
    })
    // setTimeout(() => {
    //   app.globalData.getTabBar.setData({
    //     "isPlaying": false,
    //   })
    //   this.setData({
    //     "isPlaying": true,
    //     music
    //   })
    //   app.globalData.getTabBar.setData({
    //     "isPlaying": true,
    //     'routerList[2]': {
    //       "iconPath": music.al.picUrl + '?param=200y200',
    //       "selectedIconPath": music.al.picUrl + '?param=200y200',
    //       "pagePath": "/pages/player/player",
    //       "text": ""
    //     }
    //   })
    // }, 800);
  },
})