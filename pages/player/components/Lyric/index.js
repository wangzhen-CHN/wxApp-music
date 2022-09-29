//index.js
const Event = require('@/utils/event.js')
const APP = getApp()
const { formatSecond } = require('@/utils/tools.js')

Component({
  properties: {
    _lyricIndex: {
      type: Number,
      value: 0
    }
  },
  options: {
    styleIsolation: 'shared'
  },
  data: {
    currentPlaying: {},
    lyricScrollH: 0, //歌词滚动高度
    lyricIndex: 0, //当前播放行
    currentTime: '00:00',
    processNum: 0, //当前播放百分百
    lyricList: [], //歌词列表
    totalTime: '99:99'
  },
  observers: {
    //监听
    _lyricIndex: function (value) {
      this.setData({
        lyricIndex: value
      })
    }
  },
  ready: function () {
    let index = 0
    let num = 0
    const { lyricScrollH, lyricIndex, lyricList, currentTime, totalTime, processNum } = APP.globalData.currentPlaying
    this.setData({
      lyricScrollH, //歌词滚动高度
      lyricIndex, //当前播放行
      lyricList, //歌词列表
      currentTime: formatSecond(currentTime),
      totalTime: formatSecond(totalTime),
      processNum: (currentTime / totalTime).toFixed(3) * 100 //当前播放百分百
    })
    setInterval(() => {
      const currentT = currentTime + num
      num++
      this.setData({ currentTime: formatSecond(currentT), processNum: (currentT / totalTime).toFixed(3) * 100 })
      if (parseFloat(lyricList?.[index]?.[0]) <= currentT) {
        index++
        this.setData({
          lyricIndex: index,
          currentTime: formatSecond(currentT),
          lyricScrollH: index > 3 ? (index - 3) * 28 : 0
        })
      }
    }, 1000)
    // Event.$emit({
    //   name: 'EMIT_PlayingData',
    //   data: {lyricIndex:index,isPlaying:true}
    // })
  },
  methods: {}
})
