//index.js
// const api = require('utils/request.js')
const APP = getApp()
Component({
  options: {
    styleIsolation: 'shared',
  },
  data: {
    noLyric: false, //是否有歌词
    //文稿数组，转化完成用来在wxml中使用
    lyricList: [],
    //文稿滚动距离
    marginTop: 0,
    //当前正在第几行
    currentIndex: 0,
    totalTime: '99:99', //总音乐时间（00:00格式）
    currentTime: '00:00', //当前音乐时间（00:00格式）
    processNum: 0 //播放百分百
  },
  ready: function () {
    const BGM = APP.globalData.backgroundAudioManager
    this.setData({
      totalTime: this.formatSecond(BGM.duration),
      lyricList: this.parseLyric(APP.globalData.lyric)
    })
    //监听背景音乐进度更新事件
    let index = 0
    BGM.onTimeUpdate(() => {
      const currentIndex = this.data.currentIndex
      //判断当前行
      if (currentIndex == this.data.lyricList.length) return
      const currentTime = BGM.currentTime //播放器时间
      if (parseFloat(this.data.lyricList[currentIndex][0]) <= currentTime) {
        // this.lineHigh(this.data.currentIndex) //高亮当前行
        index++
        this.setData({
          currentIndex: index,
          marginTop: index > 3 ? (index - 3) * 28 : 0
        })
      }
      this.setData({
        currentTime: this.formatSecond(BGM.currentTime),
        processNum: (BGM.currentTime / BGM.duration).toFixed(3) * 100
      })
    })
  },
  methods: {
    
  }
})
