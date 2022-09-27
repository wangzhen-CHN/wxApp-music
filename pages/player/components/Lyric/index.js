//index.js
const APP = getApp()
Component({
  options: {
    styleIsolation: 'shared'
  },
  data: {
    currentPlaying: APP.globalData.currentPlaying,
    lyricScrollH: APP.globalData.currentPlaying.lyricScrollH, //歌词滚动高度
    lyricIndex: APP.globalData.currentPlaying.lyricIndex, //当前播放行
    currentTime: APP.globalData.currentPlaying.currentTime, //音乐当前播放时间（00:00格式）
    processNum: APP.globalData.currentPlaying.processNum, //当前播放百分百
    lyricList: APP.globalData.currentPlaying.lyricList, //歌词列表
    totalTime: APP.globalData.currentPlaying.totalTime
  },
  observers: {
    //监听n1 和 n2 的数值变化
    currentPlaying: function (newN1) {
      console.log('aaaaaaa', newN1)
    },
    'APP.globalData.currentPlaying': function (newN1) {
      console.log('bbbbbb', newN1)
    }
  },
  methods: {}
})
