//index.js
// const api = require('@/utils/request.js')
const APP = getApp();

Component({
  data: {
    // 这里是一些组件内部数据
    banners: [],
    isloading: true,
  },
  ready: function () {
    APP.$get('/banner?type=2').then(res => {
      this.setData({
        isloading: false,
        banners: res.banners,
      })
    })
  },
  methods: {
    swiperChange: function (e) {
      this.setData({
        currentSwiper: e.detail.current
      })
    },
    playBannerSong(e) {
      const banner = e.currentTarget.dataset.banner
      console.log('banner', banner)
      if (banner.song) {
        const music = banner.song
        APP.play(music.id)
        console.log('music', music)
        APP.globalData.getTabBar.setData({
          "isPlaying": true,
          'routerList[2]': {
            "iconPath": music.al.picUrl + '?param=200y200',
            "selectedIconPath": music.al.picUrl + '?param=200y200',
            "pagePath": "/pages/player/player",
            "text": ""
          }
        })
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/player/player',
          })
        }, 300);
      } else {
        wx.navigateTo({
          url: `/pages/songList/songList?listId=${banner.targetId}&type=album`,
        })
      }

    }
  }
})