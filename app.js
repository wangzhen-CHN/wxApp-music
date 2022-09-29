const api = require('/utils/request.js')
const { parseLyric, formatSecond } = require('/utils/tools.js')
const Event = require('/utils/event.js')
App({
  $get: api.get,
  $post: api.post,
  globalData: {
    isPlaying: false, //是否正在播放
    currentPlaying: {
      // 当前播放中的歌曲信息
      songInfo: {},
      musicId: '', //ID
      musicImg: '', //音频图片
      lyricList: [], //歌词列表
      lyricScrollH: 0, //歌词滚动高度
      lyricIndex: 0, //当前播放行
      totalTime: '99:99', //音乐总时间（00:00格式）
      currentTime: '00:00', //音乐当前播放时间（00:00格式）
      processNum: 0 //当前播放百分百
    },
    BGM: {}, //播放器
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
      this.globalData.currentPlaying.lyricList = parseLyric(res.lrc.lyric)
    })
    api.get('/song/detail?ids=' + musicId).then((res) => {
      if (res.songs.length !== 0) {
        console.log('播放歌曲名称', res.songs[0].ar[0].name)
        if (res.songs[0].fee === 1) {
          wx.showToast({
            title: '还不能播放收费歌曲哦~~',
            icon: 'none'
          })
          return this.nextSong()
        }
        this.globalData.currentPlaying = {
          ...this.globalData.currentPlaying,
          musicId, //id
          musicImg: res.songs[0].al.picUrl, //歌曲图片
          songInfo: res.songs[0] //歌曲完整信息
        }
        //播放器信息
        this.globalData.BGM.title = res.songs[0].name //音频标题
        this.globalData.BGM.singer = res.songs[0].ar[0].name //音频歌手
        this.globalData.BGM.coverImgUrl = res.songs[0].al.picUrl //音频图片
        this.globalData.BGM.src = `https://music.163.com/song/media/outer/url?id=${musicId}.mp3`
        this.globalData.BGM.play()
      } else {
        wx.showToast({
          title: '音乐播放出了点状况~~',
          icon: 'none'
        })
      }
    })
  },
  // 创建音频播放
  createBackgroundAudioManager() {
    let index = 0
    const BGM = wx.getBackgroundAudioManager() //生成音乐播放器
    this.globalData.BGM = BGM
    BGM.onPlay(() => {
      this.globalData.isPlaying = true
    })
    //监听背景音乐进度更新事件
    BGM.onTimeUpdate(() => {
      const lyricList = this.globalData.currentPlaying.lyricList
      //判断当前行
      if (index == lyricList.length) return
      this.globalData.currentPlaying.totalTime = BGM.duration
      this.globalData.currentPlaying.currentTime = BGM.currentTime + 0.5
      // this.globalData.currentPlaying.processNum = (BGM.currentTime / BGM.duration).toFixed(3) * 100
      if (parseFloat(lyricList[index][0]) <= BGM.currentTime) {
        index++
        this.globalData.currentPlaying.lyricIndex = index
        this.globalData.currentPlaying.lyricScrollH = index > 3 ? (index - 3) * 26 : 0
        // Event.$emit({
        //   name: 'EMIT_PlayingData',
        //   data: {lyricIndex:index,isPlaying:true}
        // })
      }
    })
    //播放结束
    BGM.onEnded(() => {
      Event.$emit({
        name: 'EMIT_PlayingData',
        data: {isPlaying:false}
      })
      this.nextSong()
    })
    //停止
    BGM.onStop(() => {
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
    //暂停
    BGM.onPause(() => {
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
      this.globalData.playList.shift()
      // const songId = this.globalData.playList.shift()
      // this.globalData.playList.push(songId)
      this.play(this.globalData.playList[0])
    }
  }
})
