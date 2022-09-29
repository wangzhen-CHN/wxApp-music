//获取应用实例
const APP = getApp()
const Event = require('@/utils/event.js')
Page({
  data: {
    coverImgUrl: 'https://p1.music.126.net/5ps6sZV7wq0OG1V2JjnuDA==/109951165040573781.jpg',
    musicId: -1, //音乐id
    currentPlaying:{},
    hidden: false, //加载动画是否隐藏
    height: 44,
    isPlaying: false, //歌曲是否播放
    currentPlaySong: {}, //歌曲信息
    hiddenLyric: true //是否隐藏歌词
  },
  //返回上一页
  goBack() {
    try {
      wx.navigateBack()
    } catch (error) {
      console.error(error)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Event.$on({
      name:"currentPlaying",
      tg:this,
      success:(res)=>{
        this.setData({currentPlaying:res})
      }
    })
    const musicId = APP.globalData.currentPlaying.musicId
    const currentPlaySong = APP.globalData.currentPlaying.songInfo
    if (currentPlaySong.name) {
      this.setData({
        musicId,
        isPlaying: true,
        currentPlaySong
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        wx.setStorageSync('systemInfo', res)
        this.setData({
          height: res.statusBarHeight || 44
        })
      }
    })
  },
  // 历史歌单去重
  unique(arr, musicId) {
    let index = arr.indexOf(musicId) //使用indexOf方法，判断当前musicId是否已经存在，如果存在，得到其下标
    if (index != -1) {
      //如果已经存在在历史播放中，则删除老记录，存入新记录
      arr.splice(index, 1)
      arr.push(musicId)
    } else {
      arr.push(musicId) //如果不存在，则直接存入历史歌单
    }
    return arr //返回新的数组
  },

  // 播放上一首歌曲
  beforeSong() {
    // if (APP.globalData.history_songId.length > 1) {
    //   APP.globalData.playList.unshift(APP.globalData.history_songId.pop())//将当前播放歌曲从前插入待放列表
    //   this.play(APP.globalData.history_songId[APP.globalData.history_songId.length - 1])  //播放历史歌单歌曲
    // } else {
    //   this.tips('前面没有歌曲了哦', '去选歌', true)
    // }
  },
  // 下一首歌曲
  nextSong() {
    APP.nextSong()
    setTimeout(() => {
      console.log('音乐信息', APP.globalData.currentPlaySong)
      this.setData({
        currentPlaySong: APP.globalData.currentPlaySong
      })
    }, 500)
    // if (APP.globalData.playList.length > 0) {
    //   this.play(APP.globalData.playList.shift())//删除待放列表第一个元素并返回播放
    // } else {
    //   this.tips('后面没有歌曲了哦', '去选歌', true)
    // }
  },
  // 播放和暂停
  onPlay() {
    const BGM = APP.globalData.BGM
    if (this.data.isPlaying) {
      BGM.pause() //暂停
    } else {
      //如果当前处于暂停状态
      BGM.play() //播放
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  // 点击切换歌词和封面
  showLyric() {
    this.setData({
      hiddenLyric: !this.data.hiddenLyric
    })
  },
})
