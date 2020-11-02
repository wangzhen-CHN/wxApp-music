const api = require('./utils/request.js')
App({
  globalData: {
    ww: 0,
    hh: 0,
    isPlay: false, //是否正在播放
    musicId: '', //当前歌曲ID
    musicUrl: '', //当前歌曲播放链接
    currentPlaySong: {}, //当前歌曲
    backgroundAudioManager: {}, //播放器
    playList: [], //播放列表（musicId）
    getTabBar: {}, //TabBar
    userInfo: {}, //用户信息
    isLogin: false //用户信息
  },
  onLaunch: function () {
    const login_token = wx.getStorageSync("login_token")
    const userInfo = wx.getStorageSync("userInfo")
    if (login_token) {
      this.globalData.isLogin = true
      this.globalData.userInfo = userInfo
    }
    wx.getSystemInfo({
      success: res => {
        wx.setStorageSync('systemInfo', res)
        this.globalData.ww = res.windowWidth;
        this.globalData.hh = res.windowHeight;
      }
    });
    this.createBackgroundAudioManager()//创建播放器
  },
  play(musicId) {
    console.log("播放歌曲ID",musicId)
    this.globalData.musicId = musicId
    api.get('/song/detail?ids=' + musicId).then(res => {
        if (res.songs.length !== 0) {
          console.log("播放歌曲名称",res.songs[0].ar[0].name)
          if (res.songs[0].fee===1) {
            wx.showToast({
              title: '收费资源',
              icon: 'none',
            })
            this.nextSong()
            return
          }
          this.globalData.currentPlaySong = res.songs[0]
          this.globalData.backgroundAudioManager.title = res.songs[0].name; //音频标题
          this.globalData.backgroundAudioManager.singer = res.songs[0].ar[0].name; //音频歌手
          this.globalData.backgroundAudioManager.coverImgUrl = res.songs[0].al.picUrl; //音频图片
          this.globalData.backgroundAudioManager.src=`https://music.163.com/song/media/outer/url?id=${musicId}.mp3`
          this.globalData.backgroundAudioManager.play()
        } else {
          wx.showToast({
            title: '音乐播放出了点状况~~',
            icon: 'none',
          })
        }
      })
      .catch(err => {
        wx.showToast({
          title: '音乐播放出了点状况~~',
          icon: 'none',
        })
      })
  },
  // 音频播放
  createBackgroundAudioManager() {
    // this.globalData.musicUrl = `https://music.163.com/song/media/outer/url?id=${musicId}.mp3`
    const backgroundAudioManager = wx.getBackgroundAudioManager(); //生成音乐播放器
    // console.log('当前播放：', this.globalData.currentPlaySong.name);
    // if (backgroundAudioManager.src != this.globalData.musicUrl) { //首次放歌或者切歌
    //   backgroundAudioManager.title = this.globalData.currentPlaySong.name; //音频标题
    //   backgroundAudioManager.singer = this.globalData.currentPlaySong.ar[0].name; //音频歌手
    //   backgroundAudioManager.coverImgUrl = this.globalData.currentPlaySong.al.picUrl; //音频图片
    //   // backgroundAudioManager.src = this.globalData.musicUrl; // 立即播放
    // }
    // this.globalData.isPlay = true
    this.globalData.backgroundAudioManager = backgroundAudioManager

    backgroundAudioManager.onEnded(() => { //下一首
      this.nextSong();
    })
    backgroundAudioManager.onStop(() => { //停止
      this.globalData.getTabBar.setData({
        "isPlay": false,
        'routerList[2]': {
          "selectedIconPath": "../images/nav-active/play.png",
          "iconPath": "../images/nav/play.png",
          "pagePath": "/pages/player/player",
        }
      })
    })
    backgroundAudioManager.onPause(() => { //暂停
      this.globalData.getTabBar.setData({
        "isPlay": false,
        "isPause": true,
      })
    })
  },
  // 下一首
  nextSong() {
    if (this.globalData.playList.length > 0) {
      console.log(this.globalData.playList)
      this.globalData.playList.shift()
      console.log(this.globalData.playList)
      // const songId = this.globalData.playList.shift()
      // this.globalData.playList.push(songId)
      this.play(this.globalData.playList[0])
    } else {
      wx.showToast({
        title: '播放列表为空',
        icon: 'none',
      })
    }
  },
})