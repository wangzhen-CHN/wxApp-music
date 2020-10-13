const api = require('./utils/request.js')
App({
  globalData: {
    ww: 0,
    hh: 0,
    isPlay: '',                 //是否正在播放
    musicId: '',                //当前歌曲ID
    musicUrl: '',               //当前歌曲播放链接
    currentPlaySong:{},         //当前歌曲
    backgroundAudioManager:{},  //播放器
    playList:[],                //播放列表（musicId）
    getTabBar:{}                //TabBar
  },
  onLaunch: function () {
    wx.getSystemInfo({
      success: res => {
        wx.setStorageSync('systemInfo', res)
        this.globalData.ww = res.windowWidth;
        this.globalData.hh = res.windowHeight;
      }
    });
  },
  play(musicId) {
    this.globalData.musicId = musicId
    api.get('/song/detail?ids=' + musicId).then(res => {
        if (res.songs.length !== 0) { 
          this.globalData.currentPlaySong=res.songs[0]
          this.globalData.playList.unshift(musicId)
          this.createBackgroundAudioManager(musicId)
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
  createBackgroundAudioManager(musicId) {
    this.globalData.musicUrl=`https://music.163.com/song/media/outer/url?id=${musicId}.mp3`
    const backgroundAudioManager = wx.getBackgroundAudioManager(); //生成音乐播放器
    console.log('播放列表', this.globalData.playList);
    console.log('当前播放：', this.globalData.currentPlaySong.name);
    if (backgroundAudioManager.src != this.globalData.musicUrl) { //首次放歌或者切歌
      backgroundAudioManager.title = this.globalData.currentPlaySong.name; //音频标题
      backgroundAudioManager.singer = this.globalData.currentPlaySong.ar[0].name; //音频歌手
      backgroundAudioManager.coverImgUrl =this.globalData.currentPlaySong.al.picUrl; //音频图片
      backgroundAudioManager.src = this.globalData.musicUrl; // 立即播放
    }
    this.globalData.isPlay = true
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
        'routerList[2]': {
          "selectedIconPath": "../images/nav-active/play.png",
          "iconPath": "../images/nav/play.png",
          "pagePath": "/pages/player/player",
         
        }
      })
    })
  },
    // 下一首
    nextSong() {
      if (this.globalData.playList.length > 0) {
       const song= this.globalData.playList.shift()
       this.globalData.playList.push(song)
        this.play(song)
      } else {
        wx.showToast({
          title: '播放列表为空',
          icon: 'none',
        })
      }
    },
})