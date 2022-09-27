const api = require('./utils/request.js')
App({
  $get: api.get,
  $post: api.post,
  globalData: {
    isPlaying: false, //是否正在播放
    currentPlaying:{ // 当前播放中的歌曲信息
      musicId: '', //ID
      musicUrl: '', //播放链接
      lyricList: '',//歌词列表
      lyricScrollH: 0,//歌词滚动高度
      lyricIndex: 0,//当前播放行
      totalTime: '99:99', //音乐总时间（00:00格式）
      currentTime: '00:00', //音乐当前播放时间（00:00格式）
      processNum: 0 //当前播放百分百
    },
    backgroundAudioManager: {}, //播放器
    playList: [], //播放列表（musicId）
    getTabBar: {}, //TabBar
    userInfo: {}, //用户信息
    isLogin: false //用户信息
  },
  onLaunch: function () {
    const login_token = wx.getStorageSync('login_token')
    const userInfo = wx.getStorageSync('userInfo')
    if (login_token) {
      this.globalData.isLogin = true
      this.globalData.userInfo = userInfo
    }
    this.createBackgroundAudioManager() //创建播放器
  },
  play(musicId) {
    console.log('播放歌曲ID', musicId)
    //获取歌词
    api.get('/lyric?id=' + musicId).then((res) => {
      this.globalData.lyric = res.lrc.lyric
    })
    return new Promise((resolve, reject) => {
      api
        .get('/song/detail?ids=' + musicId)
        .then((res) => {
          if (res.songs.length !== 0) {
            console.log('播放歌曲名称', res.songs[0].ar[0].name)
            if (res.songs[0].fee === 1) {
              wx.showToast({
                title: '还不能播放收费歌曲哦~~',
                icon: 'none'
              })
              reject()
              this.nextSong()
              return
            }
            resolve()
            this.globalData.musicId = musicId
            this.globalData.currentPlaySong = res.songs[0]
            this.globalData.backgroundAudioManager.title = res.songs[0].name //音频标题
            this.globalData.backgroundAudioManager.singer = res.songs[0].ar[0].name //音频歌手
            this.globalData.backgroundAudioManager.coverImgUrl = res.songs[0].al.picUrl //音频图片
            console.log('播放歌曲链接', `https://music.163.com/song/media/outer/url?id=${musicId}.mp3`)
            this.globalData.backgroundAudioManager.src = `https://music.163.com/song/media/outer/url?id=${musicId}.mp3`
            this.globalData.backgroundAudioManager.play()
          } else {
            reject()
            wx.showToast({
              title: '音乐播放出了点状况~~',
              icon: 'none'
            })
          }
        })
        .catch((err) => {
          reject()
          wx.showToast({
            title: '音乐播放出了点状况~~',
            icon: 'none'
          })
        })
    })
  },
  // 音频播放
  createBackgroundAudioManager() {
    const backgroundAudioManager = wx.getBackgroundAudioManager() //生成音乐播放器
    this.globalData.backgroundAudioManager = backgroundAudioManager
    backgroundAudioManager.onPlay(() => {
       this.globalData.isPlaying = true
    })
    backgroundAudioManager.onEnded(() => {
      this.globalData.isPlaying = false
      //下一首
      this.nextSong()
    })
    backgroundAudioManager.onStop(() => {
      //停止
      this.globalData.isPlaying = false
      this.globalData.getTabBar.setData({
        isPlaying: false,
        'routerList[1]': {
          selectedIconPath: '../images/nav/play.svg',
          iconPath: '../images/nav/play.svg',
          pagePath: '/pages/player/player'
        }
      })
    })
    backgroundAudioManager.onPause(() => {
      //暂停
      this.globalData.isPlaying = false
      this.globalData.getTabBar.setData({
        isPlaying: false,
        isPause: true
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
    }
  }
})
