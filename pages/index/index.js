//index.js
//获取应用实例
const api = require('../../utils/request.js')
const app = getApp();

const audioContext = wx.getBackgroundAudioManager();
audioContext.title = "轻享云音"
audioContext.obeyMuteSwitch = false;
// audioContext.src = "https://music.163.com/song/media/outer/url?id=255020.mp3";
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    isloading: true,
    playMusicPicUrl:'',
    banners: [],
    playlists: [],
    daySong: {},
    currentSwiper: 0,
    // 小球
    hide_good_box: true,
  },
  onLoad: function () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#fff'
    })
    wx.showLoading({
      title: '请求中，请耐心等待..'
    });
    Promise.all([
      api.get('/banner?type=2'), //banner
      api.get('/personalized/newsong'), // 新歌
      api.get('/top/playlist?limit=7&cat=华语'), //歌单
      api.get('/top/list?idx=3'), //云音乐飙升榜
    ]).then(res => {
      res[2].playlists.shift()
      wx.hideLoading();
      this.setData({
        isloading: false,
        banners: res[0].banners,
        daySong: res[1].result[0],
        playlists: res[2].playlists,
        hotList: res[3].playlist.tracks
      })

    }).catch(e => {
      console.log(e)
    })
    // 小球
    this.busPos = {};
    this.busPos['x'] = app.globalData.ww * 0.5;
    this.busPos['y'] = app.globalData.hh * 0.95;
  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  play: function (e) {
    let music = e.currentTarget.dataset.music;
    console.log("播放歌曲：",music)
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`;
    audioContext.singer = music.ar[0].name;
    audioContext.epname = music.al.name;
    this.setData({"playMusicPicUrl":music.al.picUrl})

    setTimeout(() => {
      this.touchOnGoods(e)
    }, 50);
  },
  animationEnd(e){
    let music = e.currentTarget.dataset.music;
    this.getTabBar().setData({
      'list[2]': {
        "iconPath": music.al.picUrl,
        "pagePath": "/pages/pageturn/pageturn",
        "selectedIconPath": music.al.picUrl,
        "playTime": '200', //播放时长
        "play": true,
      }
    })
  },
  touchOnGoods: function (e) {
    // 如果good_box正在运动
    if (!this.data.hide_good_box) return;
    this.finger = {};
    var topPoint = {};
    this.finger['x'] = e.touches["0"].clientX;
    this.finger['y'] = e.touches["0"].clientY;
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 150;
    } else {
      topPoint['y'] = this.busPos['y'] - 150;
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2 + this.finger['x'];
    this.linePos = app.bezier([this.finger, topPoint, this.busPos], 30);
    this.startAnimation(e);
  },
  startAnimation: function (e) {
    var index = 0,
      that = this,
      bezier_points = that.linePos['bezier_points'];
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    this.timer = setInterval(function () {
      index++;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      if (index >= 28) {
        clearInterval(that.timer);
        that.animationEnd(e)
        that.setData({
          hide_good_box: true,
        })
      }
    }, 33);
  },

})