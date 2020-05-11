//index.js
//获取应用实例
const api = require('../../utils/request.js')
const audioContext = wx.getBackgroundAudioManager();
audioContext.title="轻享云音"
audioContext.obeyMuteSwitch = false;
// audioContext.src = "https://music.163.com/song/media/outer/url?id=255020.mp3";
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
    wx.showLoading({
      title: '请求中，请耐心等待..'
  });
    Promise.all([
      api.get('/banner?type=2'),                //banner
      api.get('/personalized/newsong'),         // 新歌
      api.get('/top/playlist?limit=7&cat=华语'),//歌单
      api.get('/top/list?idx=3'),              //云音乐飙升榜
    ]).then(res => {
      res[2].playlists.shift()
      wx.hideLoading();
      console.log(res)
      this.setData({
        banners: res[0].banners,
        daySong: res[1].result[0],
        playlists: res[2].playlists,
        hotList: res[3].playlist.tracks
      })
      
    }).catch(e => {
      console.log(e)
    })
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  play:function(e){
    let music = e.currentTarget.dataset.music;
    console.log(music)
    audioContext.src= `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`;
    audioContext.singer=music.ar[0].name;
    audioContext.epname=music.al.name;
    console.log(audioContext)
    this.getTabBar().setData({'list[2]':{
      "iconPath": music.al.picUrl,
      "pagePath": "/pages/pageturn/pageturn",
      "selectedIconPath": music.al.picUrl,
      "playTime":'200', //播放时长
      "play":true,
    }})
  }
})