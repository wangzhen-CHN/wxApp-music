//index.js
// const api = require('utils/request.js')
const APP = getApp()
Component({
  data: {
    // 这里是一些组件内部数据
    daySong: {},
    isloading: true
  },
  ready: function () {
    APP.$get('/personalized/newsong').then((res) => {
      // 新歌
      this.setData({
        isloading: false,
        daySong: {
          ...res.result[0],
          picUrl: res.result[0].picUrl + '?param=200y200'
        }
      })
    })
  },
  methods: {
    goPage() {
      wx.navigateTo({
        url: `/pages/bpage/index`
      })
    },
    playMusic: function (e) {
      const music = e.currentTarget.dataset.music
      APP.play(music.id) //调用全局播放方法
      setTimeout(() => {
        APP.globalData.getTabBar.setData({
          isPlaying: false
        })
        APP.globalData.getTabBar.setData({
          isPlaying: true,
          'routerList[2]': {
            iconPath: music.album.picUrl + '?param=200y200',
            selectedIconPath: music.album.picUrl + '?param=200y200',
            pagePath: '/pages/player/player',
            text: ''
          }
        })
      }, 800)
    }
  }
})
