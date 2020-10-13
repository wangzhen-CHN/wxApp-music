const api = require('../../utils/request.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,  //加载是否隐藏
    detail: [
      {
        img: '../../images/songList_message.png',
        name: '19万',
      },
      {
        img: '../../images/songList_share.png',
        name: '8870',
      },
      {
        img: '../../images/songList_download.png',
        name: '下载',
      },
      {
        img: '../../images/songList_choose.png',
        name: '多选',
      }
    ],
    userInfo: {},
    login_token: '',
    songs: [],
    playlist: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    //接受其他页面传来的数据
    let listId = options.listId||19723756
    if (Object.keys(this.data.playlist).length == 0)
    this.getPlaylistDetail(listId)
  },
  getPlaylistDetail(listId) {
    api.get('/playlist/detail?id='+listId).then(res => {
      this.setData({
        playlist: res.playlist,
        hidden: true
      })
    })
  },
  //播放音乐
  playMusic(e) {
    console.log(e)
    let musicId = e.currentTarget.dataset.id
    app.play(musicId) //调用全局播放方法
  },
  playAll() {
    let playlist = this.data.playlist.tracks
    console.log(playlist);
    let musicId = playlist.shift()
    app.play(musicId) //调用全局播放方法
    const playlistId=playlist.map(item=>item.id)
    app.globalData.playList.unshift(...playlistId)
  },
})